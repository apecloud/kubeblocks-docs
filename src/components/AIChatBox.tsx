'use client';

import { useI18n } from '@/locales/client';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import KIcon from './KIcon';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatBoxProps {
  onSendMessage?: (message: string) => Promise<string>;
}

// Markdown message component
const MarkdownMessage: React.FC<{ content: string; isDarkMode: boolean }> = ({
  content,
  isDarkMode,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const isInline = !className;

          return !isInline && language ? (
            <SyntaxHighlighter
              style={isDarkMode ? oneDark : oneLight}
              language={language}
              PreTag="div"
              customStyle={{
                margin: '8px 0',
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <Box
              component="code"
              sx={{
                backgroundColor: isDarkMode
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
              }}
              {...props}
            >
              {children}
            </Box>
          );
        },
        p: ({ children }) => (
          <Typography
            variant="body2"
            component="div"
            sx={{ mb: 1, '&:last-child': { mb: 0 } }}
          >
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <Box component="ul" sx={{ pl: 2, my: 1 }}>
            {children}
          </Box>
        ),
        ol: ({ children }) => (
          <Box component="ol" sx={{ pl: 2, my: 1 }}>
            {children}
          </Box>
        ),
        li: ({ children }) => (
          <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
            {children}
          </Typography>
        ),
        h1: ({ children }) => (
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', my: 1 }}
          >
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: 'bold', my: 1 }}
          >
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ fontWeight: 'bold', my: 1 }}
          >
            {children}
          </Typography>
        ),
        blockquote: ({ children }) => (
          <Box
            sx={{
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.05)',
              pl: 2,
              py: 1,
              my: 1,
              fontStyle: 'italic',
            }}
          >
            {children}
          </Box>
        ),
        strong: ({ children }) => (
          <Box component="strong" sx={{ fontWeight: 'bold' }}>
            {children}
          </Box>
        ),
        em: ({ children }) => (
          <Box component="em" sx={{ fontStyle: 'italic' }}>
            {children}
          </Box>
        ),
        table: ({ children }) => (
          <TableContainer
            component={Paper}
            elevation={1}
            sx={{
              my: 2,
              maxWidth: '100%',
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.02)',
            }}
          >
            <Table size="small" sx={{ minWidth: 200 }}>
              {children}
            </Table>
          </TableContainer>
        ),
        thead: ({ children }) => <TableHead>{children}</TableHead>,
        tbody: ({ children }) => <TableBody>{children}</TableBody>,
        tr: ({ children }) => <TableRow>{children}</TableRow>,
        th: ({ children }) => (
          <TableCell
            component="th"
            sx={{
              fontWeight: 'bold',
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
              borderBottom: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            }}
          >
            <Typography
              variant="body2"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              {children}
            </Typography>
          </TableCell>
        ),
        td: ({ children }) => (
          <TableCell
            sx={{
              borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            <Typography variant="body2" component="div">
              {children}
            </Typography>
          </TableCell>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const AIChatBox: React.FC<AIChatBoxProps> = ({ onSendMessage }) => {
  const t = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('aiChatBox.welcomeMessage'),
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Chat box size state
  const [chatSize, setChatSize] = useState({ width: 380, height: 700 });
  const [isResizing, setIsResizing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Resize functionality for edges
  const handleEdgeMouseDown = (edge: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    return (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = chatSize.width;
      const startHeight = chatSize.height;

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on edge
        if (edge.includes('left')) {
          const deltaX = startX - e.clientX;
          newWidth = Math.max(300, Math.min(600, startWidth + deltaX));
        }
        if (edge.includes('right')) {
          const deltaX = e.clientX - startX;
          newWidth = Math.max(300, Math.min(600, startWidth + deltaX));
        }
        if (edge.includes('top')) {
          const deltaY = startY - e.clientY;
          newHeight = Math.max(400, Math.min(900, startHeight + deltaY));
        }
        if (edge.includes('bottom')) {
          const deltaY = e.clientY - startY;
          newHeight = Math.max(400, Math.min(900, startHeight + deltaY));
        }

        setChatSize({ width: newWidth, height: newHeight });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      setIsResizing(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
  };



  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let aiResponse = '';

      if (onSendMessage) {
        aiResponse = await onSendMessage(inputValue);
      } else {
        // Call DashScope API
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: inputValue }),
          });

          if (response.ok) {
            const data = await response.json();
            aiResponse = data.response;
          } else {
            // Use default response when API call fails
            console.warn('API call failed, using default response');
            aiResponse = generateDefaultResponse(inputValue);
          }
        } catch (apiError) {
          // Use default response when network error occurs
          console.warn('Network error, using default response:', apiError);
          aiResponse = generateDefaultResponse(inputValue);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('aiChatBox.errorMessage'),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('安装') || input.includes('install')) {
      return t('aiChatBox.defaultResponses.install');
    }

    if (input.includes('数据库') || input.includes('database')) {
      return t('aiChatBox.defaultResponses.database');
    }

    if (input.includes('监控') || input.includes('monitor')) {
      return t('aiChatBox.defaultResponses.monitoring');
    }

    if (input.includes('备份') || input.includes('backup')) {
      return t('aiChatBox.defaultResponses.backup');
    }

    return t('aiChatBox.defaultResponses.default');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <Fade in={!isOpen}>
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ChatIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Fade>
      </Box>

      {/* Chat window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: chatSize.width,
            height: chatSize.height,
            zIndex: 1300,
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            resize: 'none',
            userSelect: isResizing ? 'none' : 'auto',
            border: isResizing ? `2px solid ${theme.palette.primary.main}` : 'none',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KIcon />
              <Typography variant="h6">{t('aiChatBox.title')}</Typography>
            </Box>
            <IconButton
              onClick={handleToggle}
              sx={{ color: 'white', padding: 0.5 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 1,
              backgroundColor: theme.palette.background.default,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  mb: 1,
                  alignItems: 'flex-start',
                  flexDirection:
                    message.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mx: 1,
                    backgroundColor:
                      message.sender === 'user'
                        ? theme.palette.secondary.main
                        : theme.palette.primary.main,
                  }}
                >
                  {message.sender === 'user' ? (
                    <PersonIcon fontSize="small" />
                  ) : (
                    <KIcon fontSize="small" />
                  )}
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    backgroundColor:
                      message.sender === 'user'
                        ? theme.palette.primary.light
                        : theme.palette.background.paper,
                    color:
                      message.sender === 'user'
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                  }}
                >
                  {message.sender === 'ai' ? (
                    <MarkdownMessage
                      content={message.text}
                      isDarkMode={isDarkMode}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.text}
                    </Typography>
                  )}
                </Paper>
              </Box>
            ))}

            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: theme.palette.primary.main,
                  }}
                >
                  <KIcon fontSize="small" />
                </Avatar>
                <Paper elevation={1} sx={{ p: 1.5 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                    {t('aiChatBox.thinking')}
                  </Typography>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input area */}
          <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder={t('aiChatBox.placeholder')}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{ minWidth: 'auto', px: 1.5 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>

          {/* Invisible resize edges */}
          {/* Top edge */}
          <Box
            onMouseDown={handleEdgeMouseDown('top')}
            sx={{
              position: 'absolute',
              top: 0,
              left: 8,
              right: 8,
              height: 4,
              cursor: 'n-resize',
              zIndex: 10,
            }}
          />
          {/* Bottom edge */}
          <Box
            onMouseDown={handleEdgeMouseDown('bottom')}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 8,
              right: 8,
              height: 4,
              cursor: 's-resize',
              zIndex: 10,
            }}
          />
          {/* Left edge */}
          <Box
            onMouseDown={handleEdgeMouseDown('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: 8,
              bottom: 8,
              width: 4,
              cursor: 'w-resize',
              zIndex: 10,
            }}
          />
          {/* Right edge */}
          <Box
            onMouseDown={handleEdgeMouseDown('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: 8,
              bottom: 8,
              width: 4,
              cursor: 'e-resize',
              zIndex: 10,
            }}
          />
          {/* Corner resize areas */}
          {/* Top-left corner */}
          <Box
            onMouseDown={handleEdgeMouseDown('top-left')}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 8,
              height: 8,
              cursor: 'nw-resize',
              zIndex: 10,
            }}
          />
          {/* Top-right corner */}
          <Box
            onMouseDown={handleEdgeMouseDown('top-right')}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 8,
              height: 8,
              cursor: 'ne-resize',
              zIndex: 10,
            }}
          />
          {/* Bottom-left corner */}
          <Box
            onMouseDown={handleEdgeMouseDown('bottom-left')}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 8,
              height: 8,
              cursor: 'sw-resize',
              zIndex: 10,
            }}
          />
          {/* Bottom-right corner */}
          <Box
            onMouseDown={handleEdgeMouseDown('bottom-right')}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 8,
              height: 8,
              cursor: 'se-resize',
              zIndex: 10,
            }}
          />
        </Paper>
      </Slide>
    </>
  );
};

export default AIChatBox;
