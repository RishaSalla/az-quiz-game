import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// في React، يفضل ترك مهمة التوجيه لملف App.jsx 
// لضمان عدم حدوث تداخل يسبب الصفحة البيضاء
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
