function LoginSuccess(username: string) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Successful</title>
  <style>
    body {
      background: #111;
      color: #fff;
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      background: #181818;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.4);
      padding: 32px 24px;
      text-align: center;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 2rem;
      margin: 0 0 12px 0;
      letter-spacing: 1px;
    }
    p {
      color: #ccc;
      font-size: 1.1rem;
      margin-bottom: 24px;
    }
    .footer {
      margin-top: 32px;
      color: #888;
      font-size: 0.95rem;
    }
    .divider {
      border: none;
      border-top: 1px solid #333;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔒</div>
    <h1>Login Successful</h1>
    <p>Hi <b>${username}</b>,<br>Your login to <b>Tube Pay</b> was successful.<br>Welcome back!</p>
    <hr class="divider" />
    <div class="footer">
      If this wasn't you, please secure your account immediately.<br>
      &copy; Tube Pay
    </div>
  </div>
</body>
</html> 
  `;
}

export { LoginSuccess };