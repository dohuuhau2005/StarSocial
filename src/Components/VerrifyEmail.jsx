import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Đang xác minh...');
    const backend = import.meta.env.VITE_Link_backend;
    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            axios.get(`${backend}/register/verify-email?token=${token}`)
                .then(res => {
                    const data = res.data;
                    if (data.success) {
                        setMessage('Xác minh thành công! Chuyển đến trang đăng nhập...');
                        setTimeout(() => navigate('/Login'), 2000);
                    } else {
                        setMessage('Xác minh thất bại: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Lỗi xác minh:', error);
                    setMessage('Đã xảy ra lỗi khi xác minh.');
                });
        } else {
            setMessage('Không tìm thấy token xác minh.');
        }
    }, [searchParams, navigate]);

    return <div>{message}</div>;
}