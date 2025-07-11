function PaymentSent(
  username: string,
  amount: number,
  receiver: string,
  status: string
) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment ${status}</title>
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
    .status-success {
      color: #00ffae;
    }
    .status-fail {
      color: #ff4d4d;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">💸</div>
    <h1>Payment <span class="status-{{status}}">{{status}}</span></h1>
    <p>Hi <b>${username}</b>,<br>Your payment of <b>&#8377;${amount}</b> to <b>${receiver}</b> was <span class="status-${status}">${status}</span>.</p>
    <hr class="divider" />
    <div class="footer">
      Thank you for using Tube Pay.<br>
      &copy; Tube Pay
    </div>
  </div>
</body>
</html> 
  `;
}

export { PaymentSent };