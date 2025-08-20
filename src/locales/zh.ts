export default {
  HomePage: {
    title: '首页',
  },
  '404': {
    back: '返回首页',
  },
  navigation: {
    documentation: '文档',
    user: '用户文档',
    databases: '数据库',
    blogs: '博客',
    reports: '测试报告',
  },
  ReportPage: {
    report: 'KubeBlocks 测试报告',
    owner: '批准人',
    admin: '审核人',
    tester: '创建人',
  },
  actions: {
    back: '返回',
  },
  text: {
    version: '版本',
  },
  aiChatBox: {
    title: 'KubeBlocks AI',
    placeholder: '输入你的问题...',
    thinking: '正在思考...',
    welcomeMessage:
      '你好！我是 KubeBlocks AI 助手。我可以帮助你了解 KubeBlocks 的使用方法、特性和最佳实践。有什么我可以帮助你的吗？',
    defaultResponses: {
      install:
        '要安装 KubeBlocks，你可以使用 Helm 或 kbcli。推荐使用 kbcli：\n\n```bash\ncurl -fsSL https://kubeblocks.io/installer/install_cli.sh | bash\nkbcli kubeblocks install\n```\n\n详细的安装指南请查看我们的文档。',
      database:
        'KubeBlocks 支持多种数据库，包括：\n- MySQL\n- PostgreSQL\n- MongoDB\n- Redis\n- Kafka\n- Elasticsearch\n- 等等\n\n你想了解哪个数据库的具体使用方法？',
      monitoring:
        'KubeBlocks 提供了强大的监控功能，集成了 Prometheus 和 Grafana。你可以：\n- 查看集群状态\n- 监控资源使用情况\n- 设置告警规则\n\n需要帮助配置监控吗？',
      backup:
        'KubeBlocks 支持自动化备份和恢复功能：\n- 定时备份\n- 增量备份\n- 跨云备份\n- 一键恢复\n\n你想了解哪种备份场景？',
      default:
        '感谢你的问题！我可以帮助你了解 KubeBlocks 的各种功能，包括安装、数据库管理、监控、备份等。你可以问我更具体的问题，或者浏览我们的文档获取详细信息。',
    },
    errorMessage: '抱歉，我遇到了一些问题。请稍后再试。',
  },
} as const;
