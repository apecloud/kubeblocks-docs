export default {
  HomePage: {
    title: 'Home',
  },
  '404': {
    back: 'Return Home',
  },
  navigation: {
    documentation: 'Documentation',
    user: 'User Docs',
    databases: 'Databases',
    blogs: 'Blogs',
    reports: 'Test Reports',
  },
  ReportPage: {
    report: 'KubeBlocks Test Reports',
    owner: 'Approved by',
    admin: 'Reviewed by',
    tester: 'Created by',
  },
  actions: {
    back: 'Back',
  },
  text: {
    version: 'Version',
  },
  aiChatBox: {
    title: 'KubeBlocks AI',
    placeholder: 'Ask your question...',
    thinking: 'Thinking...',
    welcomeMessage:
      "Hello! I'm the KubeBlocks AI assistant. I can help you understand how to use KubeBlocks, its features, and best practices. How can I help you?",
    defaultResponses: {
      install:
        'To install KubeBlocks, you can use Helm or kbcli. We recommend using kbcli:\n\n```bash\ncurl -fsSL https://kubeblocks.io/installer/install_cli.sh | bash\nkbcli kubeblocks install\n```\n\nFor detailed installation instructions, please check our documentation.',
      database:
        'KubeBlocks supports multiple databases including:\n- MySQL\n- PostgreSQL\n- MongoDB\n- Redis\n- Kafka\n- Elasticsearch\n- And more\n\nWhich database would you like to learn more about?',
      monitoring:
        'KubeBlocks provides powerful monitoring capabilities with integrated Prometheus and Grafana. You can:\n- View cluster status\n- Monitor resource usage\n- Set up alert rules\n\nNeed help configuring monitoring?',
      backup:
        'KubeBlocks supports automated backup and restore features:\n- Scheduled backups\n- Incremental backups\n- Cross-cloud backups\n- One-click restore\n\nWhich backup scenario would you like to learn about?',
      default:
        'Thank you for your question! I can help you learn about various KubeBlocks features including installation, database management, monitoring, backups, and more. Feel free to ask me specific questions or browse our documentation for detailed information.',
    },
    errorMessage: 'Sorry, I encountered some issues. Please try again later.',
  },
} as const;
