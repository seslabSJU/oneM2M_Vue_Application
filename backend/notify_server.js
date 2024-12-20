const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 5000;

function createHeaders(origin, requestId, timestamp, responseCode) {
    return {
        'X-M2M-Origin': origin,
        'X-M2M-RI': requestId,
        'X-M2M-RSC': responseCode,
        'Content-Type': 'application/json',
        'Date': timestamp
    };
}

// JSON 데이터 처리
app.use(bodyParser.json());

// /notifications 엔드포인트
app.post('/notifications', (req, res) => {
    const notification = req.body;
    console.log('Received notification:', notification);

    if (notification?.['m2m:sgn']?.vrq) {
        // vrq 처리
        const headers = createHeaders(
            'noti-page',
            req.headers['x-m2m-ri'] || '',
            new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
            '2000' // Success response code
        );

        console.log('Verification request received and responded.');
        return res.status(200).set(headers).send();
    }

    // Notify 메시지 처리
    console.log('Notify message received:', notification);

    // Notify 메시지를 Vue로 전송
    io.emit('notification', notification);

    // 성공 응답
    res.status(200).json({ message: 'Notification processed successfully.' });
});

// WebSocket 연결 확인
io.on('connection', (socket) => {
    console.log('A client connected.');
    socket.on('disconnect', () => {
        console.log('A client disconnected.');
    });
});

// 서버 실행
server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
