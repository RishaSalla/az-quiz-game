// الهاش الخاص بكلمة المرور "00000000"
const VALID_HASHES = [
  "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9"
];

// دالة التشفير (SHA-256)
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// دالة التحقق التي تستدعيها صفحة الدخول
export const verifyCode = async (code) => {
  try {
    const hash = await sha256(code);
    return VALID_HASHES.includes(hash);
  } catch (error) {
    console.error("خطأ في التحقق:", error);
    return false;
  }
};
