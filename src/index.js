import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // 引入 Provider
import { PersistGate } from 'redux-persist/integration/react'; // 引入 PersistGate 用于持久化
import { store, persistor } from './store'; // 引入配置好的 Redux store 和 persistor
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* 使用 Provider 包裹应用，并传递 store */}
    <Provider store={store}> 
      {/* PersistGate 用于等待 Redux 状态恢复后再渲染 */}
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <App />
        </HashRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
