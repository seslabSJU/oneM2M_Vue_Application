const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // 모든 origin 허용 
        methods: ['GET', 'POST'],
    },
});

const PORT = 5000;

function createHeaders(origin, requestId, timestamp, responseCode) {
    return {
        'X-M2M-Origin': origin,
        'X-M2M-RI': requestId,
        'X-M2M-RSC': responseCode,
        'X-M2M-RVI': '2a',
        'Accept': 'application/json',
        'Date': timestamp
    };
}

// JSON 데이터 처리
const cors = require('cors')
app.use(cors({
    origin: '*', // 모든 origin 허용 (ngrok 포함)
}));

// oneM2M Content-Type 처리 (application/json 및 oneM2M 전용 타입)
app.use(bodyParser.json({ 
    type: ['application/json', 'application/vnd.onem2m-ntfy+json', 'application/*+json'] 
}));

// /notifications 및 루트(/) 엔드포인트 (TinyIoT 호환)
const handleNotification = (req, res) => {
    const notification = req.body;
    console.log('Received notification:', notification);

    if (notification?.['m2m:sgn']?.vrq) {
        // VRQ 처리
        const headers = createHeaders(
            'noti-server',
            req.headers['x-m2m-ri'] || '',
            new Date().toISOString().replace(/[-:]/g, '').split('.')[0],
            '2000' // 성공 응답 코드
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
};

// 두 경로 모두 지원 (TinyIoT: /, 일반: /notifications)
app.post('/', handleNotification);
app.post('/notifications', handleNotification);

// WebSocket 연결 확인
io.on('connection', (socket) => {
    console.log('A client connected.');

    socket.on('disconnect', () => {
        console.log('A client disconnected.');
    });
});

// 서버 실행
server.listen(PORT, () => {
    console.log(`Notify server running on http://localhost:${PORT}`);
});