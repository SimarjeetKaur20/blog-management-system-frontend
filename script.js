const API = "http://localhost:3000/api";
let currentPage = 1;

/* =======================
   AUTH FUNCTIONS
======================= */

/* REGISTER */
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registered successfully 🎉 Please login");
    window.location.href = "login.html";
  } catch (err) {
    alert("Server not reachable");
  }
}

/* LOGIN */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Login successful ✅");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Server not reachable");
  }
}

/* =======================
   POSTS + PAGINATION
======================= */

/* LOAD POSTS */
async function loadPosts() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const search = document.getElementById("search")?.value || "";

  const res = await fetch(
    `${API}/posts?page=${currentPage}&limit=5&search=${search}`,
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  const data = await res.json();
  const list = document.getElementById("posts");
  list.innerHTML = "";

  data.posts.forEach(p => {
    const li = document.createElement("li");
    li.innerText = p.title;
    list.appendChild(li);
  });

  document.getElementById("page").innerText =
    `Page ${data.currentPage} of ${data.totalPages}`;
}

/* PAGINATION */
function nextPage() {
  currentPage++;
  loadPosts();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadPosts();
  }
}
async function createPost() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const token = localStorage.getItem("token");

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  try {
    const res = await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create post");
      return;
    }

    alert("Post created successfully 🎉");

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadPosts();
  } catch (err) {
    alert("Server error while creating post");
  }
}

