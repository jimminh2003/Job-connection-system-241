import CryptoJS from 'crypto-js';

// Khóa bí mật để mã hóa - nên được lưu trữ an toàn, ví dụ qua biến môi trường
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_SECRET || 'default-secret-key';

// Khóa lưu trữ
export const STORAGE_KEYS = {
    TOKEN: 'secure_access_token',
    REFRESH_TOKEN: 'secure_refresh_token',
    USER_INFO: 'secure_user_info',
    USER_ROLE: 'secure_user_role'
};

export const TokenManager = {
    // Mã hóa dữ liệu trước khi lưu
    encrypt: (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    },

    // Giải mã dữ liệu
    decrypt: (encryptedData) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },

    // Lưu token với mã hóa và thời gian hết hạn
    setToken: (token,role, expiresIn) => {
        const tokenData = {
            value: token,
            role: role,
            expires: new Date().getTime() + expiresIn * 1000
        };
        
        // Mã hóa toàn bộ dữ liệu token
        const encryptedTokenData = TokenManager.encrypt(tokenData);
        localStorage.setItem(STORAGE_KEYS.TOKEN, encryptedTokenData);
        TokenManager.setUserRole(role);
    },

    // Lấy và kiểm tra token
    setUserRole:(role)=>{
        const encryptedRole=TokenManager.encrypt(role);
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, encryptedRole);
    },
    getUserRole:()=>{
        const encryptedRole=localStorage.getItem(STORAGE_KEYS.USER_ROLE);
        return encryptedRole?TokenManager.decrypt(encryptedRole):null;
    },
    hasRole:(role)=>{
        const userRole=TokenManager.getUserRole();
        return userRole?.toLowerCase() === role.toLowerCase();
    },
    canAccess: (path) => {
        const userRole = TokenManager.getUserRole();
        if (!userRole) return false;

        // Kiểm tra quyền truy cập dựa trên path và role
        if (path.startsWith('/admin') && userRole === 'admin') return true;
        if (path.startsWith('/applicants') && userRole === 'applicant') return true;
        if (path.startsWith('/companies') && userRole === 'company') return true;

        return false;
    },
    clearAuth: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    },

    getToken: () => {
        const encryptedTokenData = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!encryptedTokenData) return null;

        const tokenData = TokenManager.decrypt(encryptedTokenData);
        
        // Kiểm tra token hết hạn
        if (!tokenData || new Date().getTime() > tokenData.expires) {
            TokenManager.removeToken();
            return null;
        }

        return tokenData.value;
    },

    // Xóa token
    removeToken: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },

    // Kiểm tra token có hiệu lực
    isTokenValid: () => {
        return !!TokenManager.getToken();
    },

    
    // Quản lý thông tin người dùng
    setUserInfo: (userInfo) => {
        const encryptedUserInfo = TokenManager.encrypt(userInfo);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, encryptedUserInfo);
    },

    getUserInfo: () => {
        const encryptedUserInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        return encryptedUserInfo ? TokenManager.decrypt(encryptedUserInfo) : null;
    },
    
    
    isTokenExpired: () => {
        const encryptedTokenData = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!encryptedTokenData) return true;
        const tokenData = TokenManager.decrypt(encryptedTokenData);
        return !tokenData || new Date().getTime() > tokenData.expires;
    },
   
};
export const USER_ROLES = {
    ADMIN: 'admin',
    APPLICANT: 'applicant',
    COMPANY: 'company'
};
export default TokenManager;