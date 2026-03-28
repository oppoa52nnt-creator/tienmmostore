export async function onRequestPost(context) {
  const { username } = await context.request.json();
  
  // 1. Tìm xem khách này có trong kho D1 chưa
  let user = await context.env.DB.prepare(
    "SELECT * FROM users WHERE username = ?"
  ).bind(username).first();

  // 2. Nếu chưa có, tự động tạo mới tài khoản với 0đ
  if (!user) {
    await context.env.DB.prepare(
      "INSERT INTO users (username, balance) VALUES (?, 0)"
    ).bind(username).run();
    user = { username, balance: 0 };
  }

  return new Response(JSON.stringify(user));
}
