#!/usr/bin/env python3
"""
Automated translation script - Translate MDX files between different languages
Supports DeepSeek and GPT API with proprietary terminology dictionary functionality
"""

import os
import re
import yaml
import json
import argparse
import logging
from typing import Dict, List, Tuple, Optional
from pathlib import Path
# import requests  # Remove this line
from openai import OpenAI
import shutil

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GlossaryManager:
    """Proprietary terminology dictionary manager"""

    def __init__(self, glossary_file: str = None):
        self.glossary = {}
        self.glossary_file = glossary_file or os.path.join(os.path.dirname(__file__), 'glossary.json')
        self.load_glossary()

    def load_glossary(self):
        """Load glossary file"""
        try:
            if os.path.exists(self.glossary_file):
                with open(self.glossary_file, 'r', encoding='utf-8') as f:
                    glossary_data = json.load(f)
                    # Merge all categories of vocabulary
                    for category, terms in glossary_data.items():
                        self.glossary.update(terms)
                logger.info(f"Loaded {len(self.glossary)} proprietary terms")
            else:
                logger.warning(f"Glossary file does not exist: {self.glossary_file}")
        except Exception as e:
            logger.error(f"Failed to load glossary file: {e}")

    def get_glossary_prompt(self) -> str:
        """Generate glossary prompt"""
        if not self.glossary:
            return ""

        glossary_text = "\n".join([f"- {en} -> {zh}" for en, zh in self.glossary.items()])
        return f"""

Please pay special attention to the translation of the following proprietary terms:
{glossary_text}

For proprietary terms, please strictly follow the translations in the glossary. If a proprietary term is not in the glossary, please keep the original English text."""


class MDXTranslator:
    def __init__(self, api_key: str, api_type: str = "deepseek", base_url: str = None,
                 glossary_file: str = None, override_existing: bool = False,
                 source_lang: str = "en", dest_lang: str = "zh"):
        """
        Initialize translator

        Args:
            api_key: API key
            api_type: API type ("deepseek" or "gpt")
            base_url: Custom API base URL
            glossary_file: Glossary file path
            override_existing: Whether to override existing translation files
            source_lang: Source language code (e.g., "en", "zh", "ja", "fr")
            dest_lang: Destination language code (e.g., "en", "zh", "ja", "fr")
        """
        self.api_key = api_key
        self.api_type = api_type.lower()
        self.glossary_manager = GlossaryManager(glossary_file)
        self.override_existing = override_existing
        self.source_lang = source_lang
        self.dest_lang = dest_lang

        # Language mappings for better prompts
        self.lang_names = {
            "en": "English",
            "zh": "Chinese",
            "ja": "Japanese",
            "fr": "French",
            "de": "German",
            "es": "Spanish",
            "ko": "Korean",
            "ru": "Russian"
        }

        if self.api_type == "deepseek":
            self.base_url = base_url or "https://api.deepseek.com/v1"
            self.model = "deepseek-chat"
        elif self.api_type == "gpt":
            self.base_url = base_url or "https://api.openai.com/v1"
            self.model = "gpt-3.5-turbo"
        else:
            raise ValueError("api_type must be 'deepseek' or 'gpt'")

        self.client = OpenAI(
            api_key=api_key,
            base_url=self.base_url,
            http_client=None  # This can help bypass proxy issues
        )

        # File types that don't need translation
        self.skip_files = ['references/api-reference', 'cli/']

    def parse_frontmatter(self, content: str) -> Tuple[Dict, str]:
        """
        Parse frontmatter

        Returns:
            (frontmatter_dict, content_without_frontmatter)
        """
        if not content.startswith('---'):
            return {}, content

        # Find the second ---
        end_match = re.search(r'\n---\n', content[3:])
        if not end_match:
            return {}, content

        frontmatter_content = content[3:end_match.start() + 3]
        remaining_content = content[end_match.end() + 3:]

        try:
            frontmatter = yaml.safe_load(frontmatter_content)
            return frontmatter or {}, remaining_content
        except yaml.YAMLError:
            logger.warning("Failed to parse frontmatter")
            return {}, content


    def translate_frontmatter(self, frontmatter: Dict) -> Dict:
        """
        Translate frontmatter fields that contain translatable content

        Args:
            frontmatter: Dictionary containing frontmatter data

        Returns:
            Dictionary with translated frontmatter
        """
        if not frontmatter:
            return frontmatter

        # Fields that should be translated
        translatable_fields = {
            'title', 'description', 'sidebar_label', 'sidebar_position_name',
            'summary', 'abstract', 'excerpt', 'meta_description'
        }

        # Fields that should NOT be translated
        non_translatable_fields = {
            'id', 'slug', 'sidebar_position', 'hide_title', 'hide_table_of_contents',
            'draft', 'unlisted', 'date', 'authors', 'tags', 'keywords',
            'image', 'custom_edit_url', 'pagination_prev', 'pagination_next'
        }

        translated_frontmatter = {}

        for key, value in frontmatter.items():
            if key in non_translatable_fields:
                # Keep non-translatable fields as-is
                translated_frontmatter[key] = value
            elif key in translatable_fields and isinstance(value, str) and value.strip():
                # Translate translatable string fields
                try:
                    # logger.info(f"Translating frontmatter field '{key}': {value}")
                    translated_value = self.translate_frontmatter_field(value)
                    translated_frontmatter[key] = translated_value
                except Exception as e:
                    logger.warning(f"Failed to translate frontmatter field '{key}': {e}")
                    translated_frontmatter[key] = value  # Keep original on failure
            elif isinstance(value, list):
                # Handle arrays (like tags, authors)
                if key == 'tags' or key == 'keywords':
                    # Don't translate tags/keywords, keep as-is
                    translated_frontmatter[key] = value
                else:
                    # For other arrays, translate string elements
                    translated_array = []
                    for item in value:
                        if isinstance(item, str) and item.strip():
                            try:
                                translated_item = self.translate_frontmatter_field(item)
                                translated_array.append(translated_item)
                            except Exception as e:
                                logger.warning(f"Failed to translate array item in '{key}': {e}")
                                translated_array.append(item)
                        else:
                            translated_array.append(item)
                    translated_frontmatter[key] = translated_array
            elif isinstance(value, dict):
                # Handle nested objects (recursively translate)
                translated_frontmatter[key] = self.translate_frontmatter_dict(value)
            else:
                # Keep other types as-is (numbers, booleans, etc.)
                translated_frontmatter[key] = value

        return translated_frontmatter

    def calculate_max_tokens(self, input_text: str, is_frontmatter: bool = False) -> int:
        """
        Calculate appropriate max_tokens based on input length and model type

        Args:
            input_text: The text to be translated
            is_frontmatter: Whether this is frontmatter (shorter content)

        Returns:
            Appropriate max_tokens value
        """
        # Rough estimation: 1 token ≈ 4 characters for English, 1.5 for Chinese
        input_tokens = len(input_text) // 4

        # System prompt tokens (approximately)
        system_prompt_tokens = 200

        # Translation expansion factor (Chinese is often more compact, but technical terms can be longer)
        expansion_factor = 1.2

        # Calculate expected output tokens
        expected_output_tokens = int(input_tokens * expansion_factor)

        # Model-specific limits
        if self.api_type == "deepseek":
            max_context = 32000
            recommended_max_output = min(8000, max_context - system_prompt_tokens - input_tokens)
        elif self.api_type == "gpt":
            if "gpt-4" in self.model:
                max_context = 32000 if "32k" in self.model else 8000
            else:  # gpt-3.5-turbo
                max_context = 16000
            recommended_max_output = min(4000, max_context - system_prompt_tokens - input_tokens)
        else:
            recommended_max_output = 4000  # Conservative default

        # For frontmatter, use smaller limits
        if is_frontmatter:
            return min(500, recommended_max_output)

        # For regular content, use calculated value but with reasonable bounds
        calculated_max = max(expected_output_tokens, 1000)  # Minimum 1000 tokens
        final_max = min(calculated_max, recommended_max_output)

        logger.debug(f"Input tokens: ~{input_tokens}, Expected output: ~{expected_output_tokens}, Max tokens: {final_max}")
        return final_max

    def get_translation_prompt(self, is_frontmatter: bool = False) -> str:
        """Generate translation system prompt based on source and destination languages"""
        source_name = self.lang_names.get(self.source_lang, self.source_lang.upper())
        dest_name = self.lang_names.get(self.dest_lang, self.dest_lang.upper())

        glossary_prompt = self.glossary_manager.get_glossary_prompt()

        if is_frontmatter:
            return f"""You are a professional technical documentation translation assistant. Please translate the following {source_name} text to {dest_name} with these requirements:
1. This is frontmatter metadata, so keep it concise and clear
2. Maintain technical term accuracy
3. The result should be natural and fluent {dest_name}
4. For technical terms, use standard {dest_name} translations if available, otherwise keep {source_name}. If you don't know the translation, use the given glossary{glossary_prompt}
"""
        else:
            return f"""You are a professional technical documentation translation assistant. Please translate the following {source_name} technical documentation to {dest_name} with these requirements:
1. Maintain technical term accuracy
2. Keep Markdown structure unchanged
3. Do not translate content in import statements, code blocks, links, images, etc.
4. Translation should be natural and fluent, conforming to {dest_name} expression habits
5. For technical terms, use standard {dest_name} translations if available, otherwise keep {source_name}. If you don't know the translation, use the given glossary{glossary_prompt}
"""

    def translate_frontmatter_field(self, text: str) -> str:
        """
        Translate a single frontmatter field

        Args:
            text: Text to translate

        Returns:
            Translated text
        """
        if not text.strip():
            return text

        try:
            # Calculate appropriate max_tokens
            max_tokens = self.calculate_max_tokens(text, is_frontmatter=True)

            source_name = self.lang_names.get(self.source_lang, self.source_lang.upper())

            messages = [
                {
                    "role": "system",
                    "content": self.get_translation_prompt(is_frontmatter=True)
                },
                {
                    "role": "user",
                    "content": f"Please translate: {text}"
                }
            ]

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.2,  # Lower temperature for more consistent translations
                max_tokens=max_tokens
            )

            translated = response.choices[0].message.content.strip()
            return translated

        except Exception as e:
            logger.error(f"Failed to translate frontmatter field: {e}")
            return text

    def translate_frontmatter_dict(self, obj: Dict) -> Dict:
        """
        Recursively translate nested dictionary objects in frontmatter

        Args:
            obj: Dictionary object to translate

        Returns:
            Translated dictionary
        """
        translated_obj = {}

        for key, value in obj.items():
            if isinstance(value, str) and value.strip():
                try:
                    translated_obj[key] = self.translate_frontmatter_field(value)
                except Exception as e:
                    logger.warning(f"Failed to translate nested field '{key}': {e}")
                    translated_obj[key] = value
            elif isinstance(value, dict):
                translated_obj[key] = self.translate_frontmatter_dict(value)
            elif isinstance(value, list):
                translated_array = []
                for item in value:
                    if isinstance(item, str) and item.strip():
                        try:
                            translated_array.append(self.translate_frontmatter_field(item))
                        except Exception as e:
                            logger.warning(f"Failed to translate array item: {e}")
                            translated_array.append(item)
                    elif isinstance(item, dict):
                        translated_array.append(self.translate_frontmatter_dict(item))
                    else:
                        translated_array.append(item)
                translated_obj[key] = translated_array
            else:
                translated_obj[key] = value

        return translated_obj

    def split_content_by_h2(self, content: str) -> List[str]:
        """
        Split document content by H2 headings

        Args:
            content: Document content to split

        Returns:
            List of split content chunks
        """
        if not content.strip():
            return [content]

        # Use regex to match H2 headings
        h2_pattern = r'^## .+$'
        lines = content.split('\n')
        chunks = []
        current_chunk = []

        for line in lines:
            if re.match(h2_pattern, line):
                # If encountering H2 heading, save current chunk and start new chunk
                if current_chunk:
                    chunks.append('\n'.join(current_chunk))
                    current_chunk = []
                current_chunk.append(line)
            else:
                current_chunk.append(line)

        # Add the last chunk
        if current_chunk:
            chunks.append('\n'.join(current_chunk))

        # If no H2 headings found, return original content
        if not chunks:
            return [content]

        # Filter out empty chunks
        chunks = [chunk for chunk in chunks if chunk.strip()]

        logger.info(f"Document split into {len(chunks)} chunks")
        return chunks

    def split_large_chunk(self, chunk: str, max_length: int) -> List[str]:
        """
        Split a large chunk into smaller pieces by paragraphs or sentences

        Args:
            chunk: The large chunk to split
            max_length: Maximum length for each sub-chunk

        Returns:
            List of smaller chunks
        """
        if len(chunk) <= max_length:
            return [chunk]

        # First try to split by double newlines (paragraphs)
        paragraphs = chunk.split('\n\n')

        sub_chunks = []
        current_sub_chunk = ""

        for paragraph in paragraphs:
            # If single paragraph is too long, split by sentences
            if len(paragraph) > max_length:
                if current_sub_chunk:
                    sub_chunks.append(current_sub_chunk.strip())
                    current_sub_chunk = ""

                # Split long paragraph by sentences
                sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                current_sentence_chunk = ""

                for sentence in sentences:
                    potential_length = len(current_sentence_chunk) + len(sentence) + (1 if current_sentence_chunk else 0)

                    if potential_length <= max_length:
                        if current_sentence_chunk:
                            current_sentence_chunk += " " + sentence
                        else:
                            current_sentence_chunk = sentence
                    else:
                        if current_sentence_chunk:
                            sub_chunks.append(current_sentence_chunk.strip())
                        current_sentence_chunk = sentence

                if current_sentence_chunk:
                    sub_chunks.append(current_sentence_chunk.strip())
            else:
                # Normal paragraph processing
                potential_length = len(current_sub_chunk) + len(paragraph) + (2 if current_sub_chunk else 0)

                if potential_length <= max_length:
                    if current_sub_chunk:
                        current_sub_chunk += "\n\n" + paragraph
                    else:
                        current_sub_chunk = paragraph
                else:
                    if current_sub_chunk:
                        sub_chunks.append(current_sub_chunk.strip())
                    current_sub_chunk = paragraph

        # Don't forget the last sub-chunk
        if current_sub_chunk:
            sub_chunks.append(current_sub_chunk.strip())

        # Filter out empty chunks
        sub_chunks = [chunk for chunk in sub_chunks if chunk.strip()]

        logger.info(f"Large chunk split into {len(sub_chunks)} sub-chunks")
        return sub_chunks

    def translate_text_or_preserve_code(self, content: str) -> str:
        """
        Translate text content but preserve code blocks unchanged

        Args:
            content: Content that may contain text and code blocks

        Returns:
            Translated content with code blocks preserved
        """
        if not content.strip():
            return content

        # Check if the entire content is a code block
        if content.strip().startswith('```') and content.strip().endswith('```'):
            logger.info("Skipping translation for code block")
            return content  # Don't translate code blocks

        # Split content into code blocks and text
        code_block_pattern = r'(```[\s\S]*?```)'
        parts = re.split(code_block_pattern, content)

        translated_parts = []

        for part in parts:
            if not part:
                continue

            # Check if this part is a code block
            if part.startswith('```') and part.endswith('```'):
                # This is a code block, keep it unchanged
                logger.info("Preserving code block without translation")
                translated_parts.append(part)
            else:
                # This is regular text, translate it
                if part.strip():
                    logger.info("Translating text content")
                    translated_part = self.translate_text_chunk(part)
                    translated_parts.append(translated_part)
                else:
                    translated_parts.append(part)  # Keep whitespace/empty parts

        return ''.join(translated_parts)

    def split_chunk_by_sentences_and_code(self, chunk: str, max_length: int) -> List[str]:
        """
        Split chunk by parsing sentences and code blocks first
        Code blocks are kept as separate elements and won't be translated

        Args:
            chunk: The chunk to split
            max_length: Maximum length for each sub-chunk

        Returns:
            List of sub-chunks
        """
        if len(chunk) <= max_length:
            return [chunk]

        # Parse chunk into sentences and code blocks
        elements = self.parse_sentences_and_code_blocks(chunk)

        # Group elements into sub-chunks
        sub_chunks = []
        current_sub_chunk_elements = []
        current_length = 0

        for element in elements:
            element_length = len(element)

            # If it's a code block or a single element exceeds max_length, keep it as separate chunk
            if (element.strip().startswith('```') and element.strip().endswith('```')) or element_length > max_length:
                # Save current sub-chunk if not empty
                if current_sub_chunk_elements:
                    sub_chunks.append('\n'.join(current_sub_chunk_elements))
                    current_sub_chunk_elements = []
                    current_length = 0

                # Add the code block or large element as its own chunk
                sub_chunks.append(element)
                continue

            # Check if we can add this element to current sub-chunk
            potential_length = current_length + element_length + (1 if current_sub_chunk_elements else 0)  # +1 for newline

            if potential_length <= max_length:
                current_sub_chunk_elements.append(element)
                current_length = potential_length
            else:
                # Current sub-chunk is full, start new one
                if current_sub_chunk_elements:
                    sub_chunks.append('\n'.join(current_sub_chunk_elements))

                current_sub_chunk_elements = [element]
                current_length = element_length

        # Add the last sub-chunk
        if current_sub_chunk_elements:
            sub_chunks.append('\n'.join(current_sub_chunk_elements))

        # Filter out empty chunks
        sub_chunks = [chunk for chunk in sub_chunks if chunk.strip()]

        logger.info(f"Parsed into {len(elements)} elements, grouped into {len(sub_chunks)} sub-chunks")
        return sub_chunks

    def parse_sentences_and_code_blocks(self, text: str) -> List[str]:
        """
        Parse text into sentences and code blocks, keeping code blocks intact

        Args:
            text: Text to parse

        Returns:
            List of sentences and code blocks
        """
        elements = []

        # Split by code blocks first (```...```)
        code_block_pattern = r'(```[\s\S]*?```)'
        parts = re.split(code_block_pattern, text)

        for part in parts:
            if not part.strip():
                continue

            # Check if this part is a code block
            if part.startswith('```') and part.endswith('```'):
                # This is a code block, keep it intact
                elements.append(part)
            else:
                # This is regular text, split into sentences
                sentences = self.split_text_into_sentences(part)
                elements.extend(sentences)

        return elements

    def split_text_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences, preserving markdown structure

        Args:
            text: Text to split into sentences

        Returns:
            List of sentences
        """
        if not text.strip():
            return []

        sentences = []

        # Split by lines first to preserve markdown structure (headers, lists, etc.)
        lines = text.split('\n')
        current_sentence = ""

        for line in lines:
            line = line.strip()

            # Empty line - end current sentence and add line break
            if not line:
                if current_sentence:
                    sentences.append(current_sentence.strip())
                    current_sentence = ""
                sentences.append("")  # Preserve empty line
                continue

            # Markdown headers, lists, or other block elements - treat as separate sentences
            if (line.startswith('#') or line.startswith('-') or line.startswith('*') or
                line.startswith('1.') or line.startswith('>') or line.startswith('|')):
                if current_sentence:
                    sentences.append(current_sentence.strip())
                    current_sentence = ""
                sentences.append(line)
                continue

            # Regular text - split by sentence endings
            # Add current line to sentence
            if current_sentence:
                current_sentence += " " + line
            else:
                current_sentence = line

            # Check for sentence endings
            sentence_endings = re.finditer(r'[.!?]+(?:\s|$)', current_sentence)
            last_end = 0

            for match in sentence_endings:
                end_pos = match.end()
                sentence_part = current_sentence[last_end:end_pos].strip()
                if sentence_part:
                    sentences.append(sentence_part)
                last_end = end_pos

            # Keep remaining text for next iteration
            current_sentence = current_sentence[last_end:].strip()

        # Add any remaining sentence
        if current_sentence:
            sentences.append(current_sentence.strip())

        # Filter out empty sentences but preserve intentional empty lines
        return [s for s in sentences if s != "" or s == ""]


    def translate_text_chunk(self, text: str) -> str:
        """
        Translate a single text chunk while preserving formatting
        """
        if not text.strip():
            return text

        try:
            # Calculate appropriate max_tokens
            max_tokens = self.calculate_max_tokens(text, is_frontmatter=False)

            messages = [
                {
                    "role": "system",
                    "content": self.get_translation_prompt(is_frontmatter=False)
                },
                {
                    "role": "user",
                    "content": f"Please translate the following content while preserving all formatting, spacing, and line breaks:\n\n{text}"
                }
            ]

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.3,
                max_tokens=max_tokens
            )

            translated = response.choices[0].message.content.strip()

            # remove notes like （注：.*?） if dest lang is zh
            if self.dest_lang == "zh":
                # re.DOTALL flag makes the dot (.) match any character including newlines
                # Without DOTALL, dot matches any char except newline
                # This ensures we can match and remove notes that span multiple lines
                translated = re.sub(r'（注：.*?）', '', translated, flags=re.DOTALL)

            return translated

        except Exception as e:
            logger.error(f"Translation failed: {e}")
            return text

    def extract_text_and_code_blocks(self, content: str) -> List[Tuple[str, bool]]:
        """
        Extract text and code blocks from content, marking each part as text or code
        Preserves the original spacing and formatting

        Args:
            content: Content to extract from

        Returns:
            List of tuples (content_part, is_code_block)
        """
        if not content.strip():
            return [(content, False)]

        # Use capturing groups to preserve delimiters and spacing
        # This pattern captures code blocks and preserves the text around them
        code_block_pattern = r'(```[\s\S]*?```)'
        parts = re.split(code_block_pattern, content)

        extracted_parts = []
        for part in parts:
            if not part:
                continue

            # Check if this part is a code block
            is_code_block = part.startswith('```') and part.endswith('```')
            extracted_parts.append((part, is_code_block))

        return extracted_parts

    def translate_chunk_with_code_preservation(self, chunk: str) -> str:
        """
        Translate a chunk while preserving code blocks and original formatting

        Args:
            chunk: Content chunk to translate

        Returns:
            Translated chunk with code blocks preserved
        """
        if not chunk.strip():
            return chunk

        # Extract text and code blocks
        parts = self.extract_text_and_code_blocks(chunk)

        translated_parts = []
        for part_content, is_code_block in parts:
            # logger.info(f"Processing part: {part_content}, is_code_block: {is_code_block}")
            if is_code_block:
                # Keep code blocks unchanged
                logger.debug("Preserving code block without translation")
                translated_parts.append(part_content)
            else:
                # Translate text content
                if part_content.strip():
                    logger.debug("Translating text content")
                    # For large text parts, split further if needed
                    if len(part_content) > 4000:
                        sub_chunks = self.split_large_text_chunk(part_content, 4000)
                        translated_sub_parts = []
                        for sub_chunk in sub_chunks:
                            translated_sub_part = self.translate_text_chunk(sub_chunk)
                            translated_sub_parts.append(translated_sub_part)
                        # Use original spacing between sub-chunks
                        translated_part = '\n\n'.join(translated_sub_parts)
                    else:
                        translated_part = self.translate_text_chunk(part_content)
                    translated_parts.append(translated_part)
                else:
                    # Keep whitespace/empty parts unchanged to preserve formatting
                    translated_parts.append(part_content)

        return '\n\n'.join(translated_parts)

    def split_large_text_chunk(self, text: str, max_length: int) -> List[str]:
        """
        Split large text chunk into smaller pieces by paragraphs or sentences
        Only handles text content, no code blocks

        Args:
            text: Text content to split
            max_length: Maximum length for each sub-chunk

        Returns:
            List of smaller text chunks
        """
        if len(text) <= max_length:
            return [text]

        # Split by paragraphs first
        paragraphs = text.split('\n\n')

        sub_chunks = []
        current_sub_chunk = ""

        for paragraph in paragraphs:
            # If single paragraph is too long, split by sentences
            if len(paragraph) > max_length:
                if current_sub_chunk:
                    sub_chunks.append(current_sub_chunk.strip())
                    current_sub_chunk = ""

                # Split long paragraph by sentences
                sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                current_sentence_chunk = ""

                for sentence in sentences:
                    potential_length = len(current_sentence_chunk) + len(sentence) + (1 if current_sentence_chunk else 0)

                    if potential_length <= max_length:
                        if current_sentence_chunk:
                            current_sentence_chunk += " " + sentence
                        else:
                            current_sentence_chunk = sentence
                    else:
                        if current_sentence_chunk:
                            sub_chunks.append(current_sentence_chunk.strip())
                        current_sentence_chunk = sentence

                if current_sentence_chunk:
                    sub_chunks.append(current_sentence_chunk.strip())
            else:
                # Normal paragraph processing
                potential_length = len(current_sub_chunk) + len(paragraph) + (2 if current_sub_chunk else 0)

                if potential_length <= max_length:
                    if current_sub_chunk:
                        current_sub_chunk += "\n\n" + paragraph
                    else:
                        current_sub_chunk = paragraph
                else:
                    if current_sub_chunk:
                        sub_chunks.append(current_sub_chunk.strip())
                    current_sub_chunk = paragraph

        # Add the last sub-chunk
        if current_sub_chunk:
            sub_chunks.append(current_sub_chunk.strip())

        # Filter out empty chunks
        sub_chunks = [chunk for chunk in sub_chunks if chunk.strip()]

        return sub_chunks

    def translate_text(self, text: str) -> str:
        """
        Translate text, processing by chunks with clear text/code separation
        """
        if not text.strip():
            return text

        # Dynamic threshold based on model capabilities
        direct_translation_threshold = 4000

        # If content is short, translate directly
        if len(text) < direct_translation_threshold:
            logger.info("Document content is short, translating directly")
            return self.translate_chunk_with_code_preservation(text)

        # Split content by H2 headings for better organization
        chunks = self.split_content_by_h2(text)
        logger.info(f"Document split into {len(chunks)} chunks by H2 headings")

        translated_chunks = []
        for i, chunk in enumerate(chunks):
            logger.info(f"Processing chunk {i+1}/{len(chunks)}...")

            # Translate chunk with code preservation
            translated_chunk = self.translate_chunk_with_code_preservation(chunk)
            translated_chunks.append(translated_chunk)

        # Join all translated chunks
        result = '\n\n'.join(translated_chunks)
        logger.info(f"Translation completed for all {len(chunks)} chunks")

        return result


    def translate_mdx_file(self, input_path: str, output_path: str) -> None:
        """
        Translate MDX file
        """
        logger.info(f"Starting to translate file: {input_path}")

        # Check if file already exists and whether to override
        if os.path.exists(output_path) and not self.override_existing:
            logger.info(f"File already translated, skipping: {input_path}")
            return
        elif os.path.exists(output_path) and self.override_existing:
            logger.info(f"File already exists, but will override: {input_path}")

        # Read file
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse frontmatter
        frontmatter, main_content = self.parse_frontmatter(content)

        # Translate frontmatter
        translated_frontmatter = self.translate_frontmatter(frontmatter)
        # # todo: for debug, remove this later
        # translated_frontmatter = frontmatter

        # Translate main content
        translated_content = self.translate_text(main_content)

        # Reassemble file
        if translated_frontmatter:
            # write frontmatter before translated content
            frontmatter_yaml = yaml.dump(translated_frontmatter, default_flow_style=False, allow_unicode=True)
            # add splitter '---' before and after frontmatter
            final_content = f"---\n{frontmatter_yaml}---\n{translated_content}"
        else:
            final_content = translated_content

        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Write translated file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(final_content)

        logger.info(f"Translation completed, output file: {output_path}")

    def translate_directory(self, input_dir: str, output_dir: str) -> None:
        """
        Translate entire directory
        """
        input_path = Path(input_dir)
        output_path = Path(output_dir)

        if not input_path.exists():
            logger.error(f"Input directory does not exist: {input_dir}")
            return

        if not output_path.exists():
            os.makedirs(output_path, exist_ok=True)

        mdx_files = list(input_path.glob("**/*.mdx"))
        # Find all yml files
        yml_files = list(input_path.glob("**/_category_.yml"))
        yaml_files = list(input_path.glob("**/_category_.yaml"))
        yml_files.extend(yaml_files)

        # Process YAML files first
        for yml_file in yml_files:
            # get relative path from input_path to yml_file
            relative_path = yml_file.relative_to(input_path)
            target_file = output_path / relative_path

            # Ensure the target directory exists
            target_file.parent.mkdir(parents=True, exist_ok=True)
            # if target_file exists, skip
            if target_file.exists() and not self.override_existing:
                logger.info(f"Skipping existing YAML file: {yml_file}")
                continue

            try:
                # Read YAML file with proper loader
                with open(yml_file, 'r', encoding='utf-8') as f:
                    yaml_data = yaml.safe_load(f)

                # translate label if it exists
                if yaml_data and 'label' in yaml_data:
                    original_label = yaml_data['label']
                    translated_label = self.translate_frontmatter_field(original_label)
                    yaml_data['label'] = translated_label
                    logger.info(f"Translated YAML label: '{original_label}' -> '{translated_label}'")

                # write back to _category_.yml
                with open(target_file, 'w', encoding='utf-8') as f:
                    yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True)

                logger.info(f"Processed YAML file: {yml_file} -> {target_file}")

            except Exception as e:
                logger.error(f"Failed to process YAML file {yml_file}: {e}")
                # Copy original file if translation fails
                shutil.copy(yml_file, target_file)

        # Process MDX files
        if not mdx_files:
            logger.warning(f"No MDX files found in directory {input_dir}")
            return

        logger.info(f"Found {len(mdx_files)} MDX files")

        for mdx_file in mdx_files:
            # Calculate relative path
            relative_path = mdx_file.relative_to(input_path)
            # ignore files if in skip_files
            if any(skip_file in str(relative_path) for skip_file in self.skip_files):
                logger.info(f"Skipping file: {mdx_file.name}, path: {relative_path}")
                # Ensure target directory exists before copying
                target_file = output_path / relative_path
                target_file.parent.mkdir(parents=True, exist_ok=True)
                # copy file to output_path
                shutil.copy(mdx_file, target_file)
                continue
            # add progress idx/total files
            idx = mdx_files.index(mdx_file)
            logger.info(f"Translating file {mdx_file.name}... {idx+1}/{len(mdx_files)}")
            output_file = output_path / relative_path
            # Translate file
            self.translate_mdx_file(str(mdx_file), str(output_file))

def main():
    parser = argparse.ArgumentParser(description="MDX file automatic translation tool")
    parser.add_argument("--input", "-i", required=True, help="Input directory or file path")
    parser.add_argument("--output", "-o", required=True, help="Output directory or file path")
    parser.add_argument("--api-key", "-k", required=True, help="API key")
    parser.add_argument("--api-type", "-t", choices=["deepseek", "gpt"], default="deepseek", help="API type")
    parser.add_argument("--base-url", "-u", help="Custom API base URL")
    parser.add_argument("--glossary", "-g", help="Glossary file path")
    parser.add_argument("--override", action="store_true", help="Override existing translation files")
    parser.add_argument("--source-lang", "-s", default="en", help="Source language code (e.g., en, zh, ja, fr)")
    parser.add_argument("--dest-lang", "-d", default="zh", help="Destination language code (e.g., en, zh, ja, fr)")

    args = parser.parse_args()

    # Validate language codes
    supported_langs = ["en", "zh", "ja", "fr", "de", "es", "ko", "ru"]
    if args.source_lang not in supported_langs:
        logger.warning(f"Source language '{args.source_lang}' may not be fully supported. Supported: {supported_langs}")
    if args.dest_lang not in supported_langs:
        logger.warning(f"Destination language '{args.dest_lang}' may not be fully supported. Supported: {supported_langs}")

    if args.source_lang == args.dest_lang:
        logger.error("Source and destination languages cannot be the same")
        return

    # Create translator
    translator = MDXTranslator(
        args.api_key, args.api_type, args.base_url, args.glossary, args.override,
        args.source_lang, args.dest_lang
    )

    # Check if input is file or directory
    if os.path.isfile(args.input):
        translator.translate_mdx_file(args.input, args.output)
    elif os.path.isdir(args.input):
        translator.translate_directory(args.input, args.output)
    else:
        logger.error(f"Input path does not exist: {args.input}")

if __name__ == "__main__":
    main()
