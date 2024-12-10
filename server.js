const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// 中间件设置
app.use(express.json());
app.use(express.static('.'));

// 联系人信息文件路径
const contactsFile = path.join(__dirname, 'contacts.txt');

// 处理表单提交
app.post('/api/contact', async (req, res) => {
    try {
        console.log('收到表单提交:', req.body); // 添加日志
        
        const { name, email, timestamp } = req.body;
        
        // 格式化联系人信息
        const contactInfo = `姓名：${name}\n邮箱：${email}\n时间：${timestamp}\n------------------------\n`;
        
        // 追加写入文件
        await fs.appendFile(contactsFile, contactInfo, 'utf8');
        console.log('文件写入成功'); // 添加日志
        
        res.status(200).json({ message: '提交成功' });
    } catch (error) {
        console.error('保存联系人信息时出错:', error);
        res.status(500).json({ 
            message: '提交失败',
            error: error.message 
        });
    }
});

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ 
        message: '服务器错误',
        error: err.message 
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`联系人信息将保存在: ${contactsFile}`);
}); 