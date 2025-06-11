import React, { useState } from 'react';

interface SendFormProps {
  apiEndpoint: string; // APIのエンドポイントURLをプロップスとして受け取る
}

const SendForm: React.FC<SendFormProps> = ({ apiEndpoint }) => {
  // --- POSTリクエスト用のstate ---
  const [postID, setPostID] = useState<string>('');
  const [postMessage, setPostMessage] = useState<string>('');
  const [postResponse, setPostResponse] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  // --- GETリクエスト用のstate ---
  const [getID, setGetID] = useState<string>('');
  const [getResponse, setGetResponse] = useState<string | null>(null);
  const [getError, setGetError] = useState<string | null>(null);

  // --- POSTリクエストのハンドラ ---
  const handlePostSubmit = async () => {
    setPostResponse(null);
    setPostError(null);

    if (!postID || !postMessage) {
      setPostError('IDとメッセージの両方を入力してください。');
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postID,
          test_message: postMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'POSTリクエストに失敗しました');
      }

      const data = await response.json();
      setPostResponse(`POST成功: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setPostError(`POSTエラー: ${error.message}`);
      console.error('POSTエラー:', error);
    }
  };

  // --- GETリクエストのハンドラ ---
  const handleGetSubmit = async () => {
    setGetResponse(null);
    setGetError(null);

    if (!getID) {
      setGetError('IDを入力してください。');
      return;
    }
    const url = `${apiEndpoint}?id=${encodeURIComponent(getID)}`
    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'GETリクエストに失敗しました');
      }

      const data = await response.json();
      setGetResponse(`GET成功: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setGetError(`GETエラー: ${error.message}`);
      console.error('GETエラー:', error);
    }
  };

  return (
    <div className="app-container"> {/* 全体を囲むコンテナ */}
      <h1>API テストフォーム</h1>

      <div className="form-section">
        <h2>POST リクエスト (データ送信)</h2>
        <div>
          <label htmlFor="post-id">ID:</label>
          <input
            id="post-id"
            type="text"
            value={postID}
            onChange={(e) => setPostID(e.target.value)}
            placeholder="IDを入力"
          />
        </div>
        <div>
          <label htmlFor="post-message">メッセージ:</label>
          <input
            id="post-message"
            type="text"
            value={postMessage}
            onChange={(e) => setPostMessage(e.target.value)}
            placeholder="メッセージを入力"
          />
        </div>
        <button onClick={handlePostSubmit}>送信 (POST)</button>

        {postResponse && (
          <div className="response success">
            <h3>POSTレスポンス:</h3>
            <pre>{postResponse}</pre>
          </div>
        )}
        {postError && (
          <div className="response error">
            <h3>POSTエラー:</h3>
            <pre>{postError}</pre>
          </div>
        )}
      </div>

      <hr />

      <div className="form-section">
        <h2>GET リクエスト (データ取得)</h2>
        <div>
          <label htmlFor="get-id">ID:</label>
          <input
            id="get-id"
            type="text"
            value={getID}
            onChange={(e) => setGetID(e.target.value)}
            placeholder="取得するIDを入力"
          />
        </div>
        <button onClick={handleGetSubmit}>取得 (GET)</button>

        {getResponse && (
          <div className="response success">
            <h3>GETレスポンス:</h3>
            <pre>{getResponse}</pre>
          </div>
        )}
        {getError && (
          <div className="response error">
            <h3>GETエラー:</h3>
            <pre>{getError}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendForm;