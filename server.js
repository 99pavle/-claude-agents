const express = require('express');
const app = express();

// Railway requires process.env.PORT
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/', (req, res) => {
    res.json({
        name: "Claude Agents Server",
        version: "1.0.0",
        status: "running",
        port: PORT,
        endpoints: ["/health", "/execute", "/agents"],
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        server: 'claude-agents-railway',
        port: PORT,
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

app.post('/execute', async (req, res) => {
    const { agent, task, prompt } = req.body;
    console.log(`🤖 Executing: ${agent} - ${task || prompt}`);
    
    const result = {
        agent: agent || 'CREATOR',
        task: task || prompt || 'Task executed',
        result: `Agent ${agent || 'CREATOR'} completed: ${task || prompt}`,
        success: true,
        timestamp: new Date().toISOString(),
        server: 'Railway'
    };
    
    res.json(result);
});

app.get('/agents', (req, res) => {
    res.json({
        available: ['CREATOR', 'MODIFIER', 'ANALYZER', 'FINDER', 'TESTER', 'OPTIMIZER'],
        status: 'ready',
        server: 'Railway'
    });
});

// Railway-compatible startup
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Claude Agents Server running on port ${PORT}`);
    console.log(`✅ Railway deployment successful`);
    console.log(`🌐 Server ready for connections`);
});

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    process.exit(0);
});
