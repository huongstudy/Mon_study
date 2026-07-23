// HỆ THỐNG THÔNG BÁO TOAST THAY THẾ ALERT MẶC ĐỊNH
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 360px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#4318ff'
  };

  toast.style.cssText = `
    background: ${bgColors[type] || bgColors.info};
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    opacity: 0;
    transform: translateY(15px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.innerText = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// 1. TÍNH NĂNG ĐỔI GIAO DIỆN SÁNG / TỐI (DARK MODE)
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('mon_theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.innerText = '☀️ Chế độ sáng';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggleBtn.innerText = '🌙 Chế độ tối';
  }

  themeToggleBtn.addEventListener('click', function () {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.innerText = '🌙 Chế độ tối';
      localStorage.setItem('mon_theme', 'light');
      showToast('☀️ Đã chuyển sang Giao diện Sáng', 'info');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.innerText = '☀️ Chế độ sáng';
      localStorage.setItem('mon_theme', 'dark');
      showToast('🌙 Đã chuyển sang Giao diện Tối', 'info');
    }
  });
}

// 2. LỜI CHÀO TỰ ĐỘNG & ĐIỂM DANH TRANG CHỦ
function initDashboardHeader() {
  const greetingElement = document.getElementById('greeting');
  if (greetingElement) {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      greetingElement.innerText = "☀️ Chào buổi sáng, Hương!";
    } else if (currentHour >= 12 && currentHour < 18) {
      greetingElement.innerText = "🌤️ Chào buổi chiều, Hương!";
    } else {
      greetingElement.innerText = "🌙 Chào buổi tối, Hương!";
    }
  }

  const checkinBtn = document.querySelector('.checkin-btn');
  if (checkinBtn) {
    const todayStr = new Date().toDateString();
    const lastCheckin = localStorage.getItem('mon_last_checkin');

    if (lastCheckin === todayStr) {
      checkinBtn.innerText = '✅ Đã điểm danh';
      checkinBtn.style.background = '#22c55e';
      checkinBtn.disabled = true;
    }

    checkinBtn.addEventListener('click', function () {
      localStorage.setItem('mon_last_checkin', todayStr);
      showToast('🎉 Chúc mừng Hương đã điểm danh thành công ngày hôm nay!', 'success');
      this.innerText = '✅ Đã điểm danh';
      this.style.background = '#22c55e';
      this.disabled = true;
    });
  }
}

// TRÍCH DẪN TRUYỀN CẢM HỨNG
const quotes = [
  '"Hành trình vạn dặm bắt đầu từ một bước chân." – Lão Tử',
  '"Thành công không phải là chìa khóa mở cửa hạnh phúc. Hạnh phúc là chìa khóa dẫn tới thành công."',
  '"Kỷ luật là cầu nối giữa mục tiêu và thành tựu."',
  '"Mỗi ngày tiến bộ 1% thì sau 1 năm bạn sẽ giỏi hơn gấp 37 lần."',
  '"Đừng mong mọi việc dễ dàng hơn, hãy mong bản thân giỏi giang hơn."',
  '"Việc học như thuyền đi ngược nước, không tiến ắt sẽ lùi."',
  '"Cách duy nhất để làm nên sự nghiệp vĩ đại là yêu những gì bạn làm."'
];

function initQuotes() {
  const quoteText = document.getElementById('quoteText');
  const newQuoteBtn = document.getElementById('newQuoteBtn');

  if (!quoteText) return;

  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteText.innerText = quotes[randomIndex];
  }

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', getRandomQuote);
  }
  getRandomQuote();
}

// 3. ĐỒNG HỒ POMODORO (30 PHÚT)
let timeLeft = 30 * 60;
let timerId = null;

function initPomodoro() {
  const timerDisplay = document.getElementById('timer');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const pauseTimerBtn = document.getElementById('pauseTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');

  if (!timerDisplay || !startTimerBtn) return;

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  startTimerBtn.addEventListener('click', function () {
    if (timerId !== null) return;

    showToast('⏱️ Bắt đầu 30 phút tập trung cao độ!', 'info');
    timerId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerId);
        timerId = null;

        try {
          let alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          alarmSound.play();
        } catch (e) {
          console.log('Audio playback prevented');
        }

        showToast('🎉 Hết 30 phút rồi! Hương hãy nghỉ ngơi 5 phút nhé!', 'success');
      }
    }, 1000);
  });

  if (pauseTimerBtn) {
    pauseTimerBtn.addEventListener('click', function () {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        showToast('⏸️ Đã tạm dừng đồng hồ', 'warning');
      }
    });
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', function () {
      clearInterval(timerId);
      timerId = null;
      timeLeft = 30 * 60;
      updateTimerDisplay();
      showToast('🔄 Đã đặt lại đồng hồ Pomodoro', 'info');
    });
  }

  updateTimerDisplay();
}

// 4. QUẢN LÝ GHI CHÚ CHUNG & LỊCH CÔNG VIỆC
function initNotesAndTasks() {
  const noteInput = document.getElementById('noteInput');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const notesList = document.getElementById('notesList');

  if (notesList) {
    let savedNotes = JSON.parse(localStorage.getItem('mon_notes') || '[]');

    function renderNotes() {
      notesList.innerHTML = '';
      savedNotes.forEach((note, index) => {
        const li = document.createElement('li');
        if (note.completed) li.classList.add('completed');

        li.innerHTML = `
          <span>${note.text}</span>
          <div class="note-actions">
            <button class="btn-done" onclick="toggleNoteDone(${index})">✓</button>
            <button class="btn-del" onclick="deleteDashboardNote(${index})">✕</button>
          </div>
        `;
        notesList.appendChild(li);
      });
      localStorage.setItem('mon_notes', JSON.stringify(savedNotes));
    }

    if (addNoteBtn && noteInput) {
      addNoteBtn.addEventListener('click', function () {
        const noteText = noteInput.value.trim();
        if (noteText === '') {
          showToast('Hương ơi, nhập nội dung ghi chú trước nhé!', 'warning');
          return;
        }
        savedNotes.push({ text: noteText, completed: false });
        noteInput.value = '';
        renderNotes();
        showToast('📌 Đã thêm ghi chú mới!', 'success');
      });
    }

    window.toggleNoteDone = function (index) {
      savedNotes[index].completed = !savedNotes[index].completed;
      renderNotes();
    };

    window.deleteDashboardNote = function (index) {
      savedNotes.splice(index, 1);
      renderNotes();
      showToast('🗑️ Đã xóa ghi chú', 'info');
    };

    renderNotes();
  }

  const currentDateElem = document.getElementById('currentDate');
  if (currentDateElem) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    currentDateElem.innerText = today.toLocaleDateString('vi-VN', options);
  }

  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  if (taskList) {
    let savedTasks = JSON.parse(localStorage.getItem('mon_tasks') || '[]');

    function renderTasks() {
      taskList.innerHTML = '';
      savedTasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('done');

        li.innerHTML = `
          <span>${task.text}</span>
          <div class="note-actions">
            <button class="btn-done" onclick="toggleTaskDone(${index})">✓</button>
            <button class="btn-del" onclick="deleteTask(${index})">✕</button>
          </div>
        `;
        taskList.appendChild(li);
      });
      localStorage.setItem('mon_tasks', JSON.stringify(savedTasks));
    }

    if (addTaskBtn && taskInput) {
      addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
          showToast('Hương ơi, nhập công việc cần làm trước nhé!', 'warning');
          return;
        }
        savedTasks.push({ text: taskText, completed: false });
        taskInput.value = '';
        renderTasks();
        showToast('🎯 Đã thêm mục tiêu mới!', 'success');
      });
    }

    window.toggleTaskDone = function (index) {
      savedTasks[index].completed = !savedTasks[index].completed;
      renderTasks();
    };

    window.deleteTask = function (index) {
      savedTasks.splice(index, 1);
      renderTasks();
      showToast('🗑️ Đã xóa công việc', 'info');
    };

    renderTasks();
  }
}

// 5. DỮ LIỆU PHÍM TẮT VÀ HÀM EXCEL
const excelShortcuts = [
  { key: "Alt + =", desc: "Tự động tính tổng (AutoSum) nhanh cho hàng hoặc cột được chọn.", example: "Alt + =" },
  { key: "Ctrl + Shift + L", desc: "Bật hoặc tắt nhanh bộ lọc dữ liệu (Filter).", example: "Ctrl + Shift + L" },
  { key: "F4", desc: "Lặp lại thao tác vừa làm HOẶC chuyển đổi tọa độ tương đối/tuyệt đối ($A$1).", example: "F4" },
  { key: "Ctrl + E", desc: "Điền dữ liệu thông minh theo mẫu (Flash Fill).", example: "Ctrl + E" },
  { key: "Ctrl + 1", desc: "Mở hộp thoại định dạng ô (Format Cells).", example: "Ctrl + 1" },
  { key: "Ctrl + T", desc: "Chuyển vùng dữ liệu được chọn thành Bảng thông minh (Table).", example: "Ctrl + T" }
];

const excelFormulas = [
  { name: "VLOOKUP", category: "lookup", type: "Tra cứu", desc: "Tìm kiếm dữ liệu theo cột dọc từ trái sang phải.", syntax: "=VLOOKUP(giá_trị_tìm, bảng_tìm, số_cột_lấy, 0)" },
  { name: "XLOOKUP", category: "lookup", type: "Tra cứu nâng cao", desc: "Hàm tra cứu hiện đại thay thế VLOOKUP/HLOOKUP, tìm mọi chiều.", syntax: "=XLOOKUP(giá_trị_tìm, cột_tìm, cột_trả_về)" },
  { name: "FILTER", category: "dynamic", type: "Mảng động", desc: "Lọc tự động danh sách dữ liệu theo điều kiện mà không cần Filter thủ công.", syntax: "=FILTER(vùng_dữ_liệu, điều_kiện_lọc, [nếu_trống])" },
  { name: "UNIQUE", category: "dynamic", type: "Mảng động", desc: "Trích xuất danh sách các giá trị duy nhất (không trùng lặp).", syntax: "=UNIQUE(vùng_dữ_liệu)" },
  { name: "IF", category: "logic", type: "Logic", desc: "Kiểm tra điều kiện đúng/sai và trả về kết quả tương ứng.", syntax: '=IF(A1>=5, "Đạt", "Trượt")' },
  { name: "COUNTIF", category: "math", type: "Thống kê", desc: "Đếm số lượng ô thỏa mãn một điều kiện nhất định.", syntax: '=COUNTIF(A1:A10, ">50")' },
  { name: "SUMIFS", category: "math", type: "Thống kê", desc: "Tính tổng các ô thỏa mãn nhiều điều kiện cùng lúc.", syntax: "=SUMIFS(vùng_tính_tổng, vùng_ĐK1, ĐK1, ...)" },
  { name: "INDEX & MATCH", category: "lookup", type: "Tra cứu linh hoạt", desc: "Bộ đôi tra cứu dữ liệu động không bị giới hạn vị trí cột.", syntax: "=INDEX(vùng_kết_quả, MATCH(giá_trị, vùng_tìm, 0))" },
  { name: "LET", category: "logic", type: "Tối ưu hóa", desc: "Khai báo biến tạm trong công thức giúp tăng tốc độ xử lý file nặng.", syntax: "=LET(x, A1*10, x + 5)" }
];

// 6. DỮ LIỆU CHI TIẾT NÂNG CAO (DASHBOARD, POWER QUERY, POWER PIVOT, DAX, VBA)
const excelAdvanced = [
  {
    id: 0,
    title: "📊 Thiết Kế Dashboard Tương Tác",
    category: "dashboard",
    type: "Dashboard",
    desc: "Kết hợp Pivot Table, Pivot Chart, Slicer & Timeline để tạo báo cáo động điều khiển chỉ bằng 1 cú click.",
    code: "PivotTable -> Insert Slicer -> Report Connections",
    steps: [
      "Bước 1: Chọn vùng dữ liệu chuẩn hóa, nhấn Ctrl + T để chuyển thành Bảng (Table).",
      "Bước 2: Vào thẻ Insert -> Chọn PivotTable -> Tạo 2-3 bảng tổng hợp theo các chiều phân tích (ví dụ: Doanh thu theo tháng, Theo sản phẩm, Theo khu vực).",
      "Bước 3: Từ mỗi PivotTable, tạo Biểu đồ động (PivotChart) tương ứng.",
      "Bước 4: Click vào một PivotTable -> Insert -> Slicer (Bộ lọc trực quan theo Sản phẩm/Khu vực) và Timeline (Lọc theo Thời gian).",
      "Bước 5: Click chuột phải vào Slicer -> Chọn Report Connections -> Tích chọn TOÀN BỘ các PivotTable trong file để kết nối đồng bộ!"
    ],
    tip: "Nên tắt đường lưới (Gridlines) trong thẻ View và thiết kế các Thẻ KPI ở trên cùng để Dashboard trông như một ứng dụng chuyên nghiệp."
  },
  {
    id: 1,
    title: "⚡ Power Query: Unpivot Columns",
    category: "power",
    type: "Power Query",
    desc: "Biến các bảng dữ liệu xoay ngang (dạng ma trận báo cáo) thành bảng dữ liệu chuẩn hóa dạng dọc chỉ trong 2 giây.",
    code: "Data -> Get Data -> Power Query Editor -> Transform -> Unpivot Columns",
    steps: [
      "Bước 1: Chọn vùng dữ liệu ngang (ví dụ các cột là Tháng 1, Tháng 2, Tháng 3...).",
      "Bước 2: Vào thẻ Data -> Chọn From Table/Range để đưa dữ liệu vào Power Query Editor.",
      "Bước 3: Giữ phím Ctrl và chọn các cột cố định (không xoay) như Mã NV, Tên NV.",
      "Bước 4: Click chuột phải vào tiêu đề cột chọn 'Unpivot Other Columns' (Xoay các cột khác).",
      "Bước 5: Đổi tên cột 'Attribute' thành 'Tháng' và 'Value' thành 'Doanh Số' -> Nhấn Close & Load để xuất kết quả ra Excel!"
    ],
    tip: "Unpivot là kỹ thuật chuẩn hóa dữ liệu bắt buộc trước khi tạo PivotTable hoặc đưa dữ liệu vào Power BI."
  },
  {
    id: 2,
    title: "🔄 Power Query: Gộp 12 File Báo Cáo Tự Động",
    category: "power",
    type: "Power Query",
    desc: "Tự động gộp 12 file Excel hàng tháng trong 1 thư mục thành 1 file tổng hợp. Hàng tháng chỉ cần chép file mới vào là xong.",
    code: "Data -> Get Data -> From File -> From Folder -> Combine & Transform Data",
    steps: [
      "Bước 1: Gom tất cả các file Excel cần gộp vào cùng một Thư mục (Folder) trên máy tính.",
      "Bước 2: Trong file Excel mới, vào Data -> Get Data -> From File -> From Folder.",
      "Bước 3: Dẫn đến thư mục chứa file và nhấn Open.",
      "Bước 4: Nhấn nút Combine -> Combine & Transform Data.",
      "Bước 5: Chọn Sheet cần lấy dữ liệu mẫu -> Power Query sẽ tự động gộp tất cả file lại với nhau!"
    ],
    tip: "Sau này khi có file báo cáo tháng mới, Hương chỉ cần bỏ file đó vào thư mục rồi bấm Data -> Refresh All là xong, không cần copy paste thủ công!"
  },
  {
    id: 3,
    title: "🔗 Power Pivot & Data Model",
    category: "dax",
    type: "Power Pivot",
    desc: "Tạo liên kết (Relationships) giữa nhiều bảng dữ liệu khác nhau mà không cần dùng hàm VLOOKUP làm chậm file.",
    code: "Power Pivot -> Add to Data Model -> Diagram View -> Drag & Drop Relationship",
    steps: [
      "Bước 1: Bật Add-in Power Pivot bằng cách vào File -> Options -> Add-ins -> Chọn COM Add-ins -> Tích chọn Power Pivot.",
      "Bước 2: Chọn từng Bảng dữ liệu (Ví dụ: Bảng Bán Hàng, Bảng Khách Hàng, Bảng Sản Phẩm) -> Nhấn Power Pivot -> Add to Data Model.",
      "Bước 3: Trong cửa sổ Power Pivot, chuyển sang chế độ 'Diagram View'.",
      "Bước 4: Kéo thả trường khóa (ví dụ: Mã_KH ở Bảng Bán Hàng thả vào Mã_KH ở Bảng Khách Hàng) để tạo mối quan hệ 1-Nhiều.",
      "Bước 5: Quay lại Excel và Insert PivotTable từ Data Model!"
    ],
    tip: "Data Model giúp file Excel xử lý hàng triệu dòng dữ liệu nhẹ nhàng mà không bao giờ lo giật lag như dùng hàm VLOOKUP."
  },
  {
    id: 4,
    title: "🧠 DAX: Hàm CALCULATE Nâng Cao",
    category: "dax",
    type: "DAX Formula",
    desc: "Hàm mạnh nhất trong Power Pivot & Power BI giúp tính toán chỉ số KPI có ghi đè bối cảnh bộ lọc.",
    code: "DoanhThu_HN = CALCULATE(SUM(Sales[Amount]), Region[City] = \"Hà Nội\")",
    steps: [
      "Bước 1: Trong Power Pivot hoặc PivotTable -> Click chuột phải vào Bảng chọn 'Add Measure'.",
      "Bước 2: Đặt tên Measure (ví dụ: DoanhThu_HaNoi).",
      "Bước 3: Nhập công thức: =CALCULATE(SUM(Sales[DoanhSo]), DimRegion[ThanhPho] = \"Hà Nội\").",
      "Bước 4: Chọn định dạng số (Currency/Number) -> Nhấn OK.",
      "Bước 5: Thả Measure vừa tạo vào PivotTable để xem chỉ số báo cáo."
    ],
    tip: "Hàm CALCULATE tương tự như SUMIFS nhưng linh hoạt hơn gấp nhiều lần vì có thể kết hợp với ALL(), USERELATIONSHIP(), SAMEPERIODLASTYEAR()."
  },
  {
    id: 5,
    title: "🤖 VBA & Macro: Xuất Báo Cáo Tự Động Ra PDF",
    category: "vba",
    type: "Automation",
    desc: "Tự động tạo và xuất hàng loạt báo cáo cá nhân ra file PDF chỉ với một nút bấm.",
    code: "Sub ExportToPDF()\n    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, _\n    Filename:=ThisWorkbook.Path & \"\\BaoCao_\" & Format(Now, \"yyyymmdd\") & \".pdf\", _\n    Quality:=xlQualityStandard\n    MsgBox \"Đã xuất PDF thành công!\"\nEnd Sub",
    steps: [
      "Bước 1: Nhấn tổ hợp phím Alt + F11 để mở cửa sổ lập trình VBA Editor.",
      "Bước 2: Vào Insert -> Module để mở một file code mới.",
      "Bước 3: Dán đoạn code VBA ở ô dưới đây vào Module.",
      "Bước 4: Quay lại giao diện Excel, vào Insert -> Shapes -> Vẽ một nút bấm.",
      "Bước 5: Click chuột phải vào Nút bấm -> Assign Macro -> Chọn 'ExportToPDF' -> OK!"
    ],
    tip: "Lưu file Excel dưới dạng 'Excel Macro-Enabled Workbook (*.xlsm)' để lưu giữ đoạn code tự động nhé."
  },
  {
    id: 6,
    title: "🎯 Thiết Kế Thẻ Chỉ Số KPI Động",
    category: "dashboard",
    type: "Dashboard UI",
    desc: "Tạo thẻ chỉ số KPI có kèm biểu tượng mũi tên tăng/giảm tự động đổi màu theo điều kiện.",
    code: "Home -> Conditional Formatting -> Icon Sets -> More Rules",
    steps: [
      "Bước 1: Nhập giá trị % Tăng trưởng vào ô KPI (Ví dụ: 15% hoặc -5%).",
      "Bước 2: Vào thẻ Home -> Conditional Formatting -> Icon Sets -> Chọn bộ 3 biểu tượng mũi tên.",
      "Bước 3: Mở lại Conditional Formatting -> Manage Rules -> Edit Rule.",
      "Bước 4: Chỉnh sửa điều kiện: Mũi tên xanh chỉ lên khi Value >= 0 (Type: Number), Mũi tên đỏ khi < 0.",
      "Bước 5: Đóng khung viền nhẹ và làm nổi bật con số với font chữ to (Bold 20pt)."
    ],
    tip: "Kết hợp Thẻ KPI với hàm TEXT hoặc đính kèm thẻ vào Shape bằng công thức =A1 để tạo card KPI nổi như ứng dụng chuyên nghiệp."
  },
  {
    id: 7,
    title: "📈 Biểu Đồ Động (Dynamic Chart)",
    category: "dashboard",
    type: "Charting",
    desc: "Tạo biểu đồ tự động mở rộng và vẽ thêm cột mới ngay khi nhập thêm dữ liệu.",
    code: "Insert -> Table (Ctrl + T) -> Insert Chart",
    steps: [
      "Bước 1: Bôi đen vùng dữ liệu ban đầu -> Nhấn Ctrl + T để biến thành Excel Table.",
      "Bước 2: Insert Biểu đồ (Cột, Đường...) dựa trên Bảng này.",
      "Bước 3: Khi nhập thêm dòng dữ liệu mới ở cuối Bảng, Bảng sẽ tự động mở rộng.",
      "Bước 4: Biểu đồ sẽ lập tức cập nhật dữ liệu mới mà không cần vẽ lại hay chỉnh sửa lại Data Range!"
    ],
    tip: "Cũng có thể dùng hàm OFFSET kết hợp với Name Manager để định nghĩa vùng dữ liệu động cho các phiên bản Excel cũ."
  }
];

function switchExcelTab(event, tabName) {
  if (event && event.currentTarget) {
    document.querySelectorAll('.excel-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
  }

  document.querySelectorAll('.excel-section').forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(`tab-${tabName}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
}

function renderShortcuts(list) {
  const grid = document.getElementById('shortcutGrid');
  if (!grid) return;
  grid.innerHTML = '';

  list.forEach(item => {
    grid.innerHTML += `
      <div class="excel-item-card">
        <div>
          <span class="excel-badge badge-shortcut">Phím tắt</span>
          <h3>${item.key}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="code-box">${item.example}</div>
      </div>
    `;
  });
}

function filterShortcuts() {
  const input = document.getElementById('shortcutSearch');
  if (!input) return;
  const query = input.value.toLowerCase();
  const filtered = excelShortcuts.filter(s =>
    s.key.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)
  );
  renderShortcuts(filtered);
}

function renderFormulas(list) {
  const grid = document.getElementById('formulaGrid');
  if (!grid) return;
  grid.innerHTML = '';

  list.forEach(item => {
    grid.innerHTML += `
      <div class="excel-item-card">
        <div>
          <span class="excel-badge badge-${item.category}">${item.type}</span>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="code-box">${item.syntax}</div>
      </div>
    `;
  });
}

function filterFormulas() {
  const input = document.getElementById('formulaSearch');
  if (!input) return;
  const query = input.value.toLowerCase();
  const filtered = excelFormulas.filter(f =>
    f.name.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query)
  );
  renderFormulas(filtered);
}

function renderAdvanced(list) {
  const grid = document.getElementById('advancedGrid');
  if (!grid) return;
  grid.innerHTML = '';

  list.forEach(item => {
    grid.innerHTML += `
      <div class="excel-item-card clickable-card" onclick="openAdvancedModal(${item.id})">
        <div>
          <div class="card-top-row">
            <span class="excel-badge badge-${item.category}">${item.type}</span>
            <span class="click-hint"><i class="fa-solid fa-arrow-right-long"></i> Xem chi tiết</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="code-box">${item.code}</div>
      </div>
    `;
  });
}

function filterAdvanced() {
  const input = document.getElementById('advancedSearch');
  if (!input) return;
  const query = input.value.toLowerCase();
  const filtered = excelAdvanced.filter(a =>
    a.title.toLowerCase().includes(query) || 
    a.desc.toLowerCase().includes(query) || 
    a.type.toLowerCase().includes(query)
  );
  renderAdvanced(filtered);
}

// 7. HIỂN THỊ POPUP BÀI HỌC NÂNG CAO CHI TIẾT
let currentModalCode = '';

function openAdvancedModal(id) {
  const item = excelAdvanced.find(a => a.id === id);
  if (!item) return;

  const modal = document.getElementById('advancedModal');
  const badge = document.getElementById('modalBadge');
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDesc');
  const stepsList = document.getElementById('modalSteps');
  const codeBlock = document.getElementById('modalCode');
  const tipText = document.getElementById('modalTip');

  if (!modal) return;

  badge.className = `excel-badge badge-${item.category}`;
  badge.innerText = item.type;
  title.innerText = item.title;
  desc.innerText = item.desc;

  // Render các bước
  stepsList.innerHTML = '';
  item.steps.forEach(step => {
    const li = document.createElement('li');
    li.innerText = step;
    stepsList.appendChild(li);
  });

  // Render Code / Thao tác mẫu
  currentModalCode = item.code;
  codeBlock.innerText = item.code;

  // Render Mẹo
  tipText.innerText = item.tip;

  // Hiển thị modal với animation
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Khóa cuộn trang
}

function closeAdvancedModal() {
  const modal = document.getElementById('advancedModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Mở lại cuộn trang
  }
}

function closeAdvancedModalOnOverlay(event) {
  if (event.target.id === 'advancedModal') {
    closeAdvancedModal();
  }
}

// Lắng nghe phím ESC để đóng modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeAdvancedModal();
  }
});

function copyModalCode() {
  if (!currentModalCode) return;
  navigator.clipboard.writeText(currentModalCode).then(() => {
    showToast('📋 Đã sao chép công thức/code vào khay nhớ tạm!', 'success');
  }).catch(() => {
    showToast('❌ Sao chép thất bại, hãy bôi đen thủ công nhé', 'error');
  });
}

const excelQuizData = [
  {
    question: "Công cụ nào giúp liên kết các Slicer để điều khiển đồng thời nhiều Pivot Table trên Dashboard?",
    options: ["Report Connections", "Data Validation", "Conditional Formatting", "Filter Connections"],
    answer: "Report Connections"
  },
  {
    question: "Trong Power Query, thao tác nào giúp chuyển các cột dữ liệu theo tháng thành 2 cột: 'Tháng' và 'Giá trị'?",
    options: ["Split Column", "Unpivot Columns", "Group By", "Transpose"],
    answer: "Unpivot Columns"
  },
  {
    question: "Phím tắt nào giúp cố định địa chỉ ô ($A$1) trong công thức Excel?",
    options: ["F2", "F4", "F8", "Ctrl + F"],
    answer: "F4"
  },
  {
    question: "Hàm nào được xem là 'ông vua' trong DAX Power Pivot giúp tính toán có điều kiện lọc?",
    options: ["SUMX", "RELATED", "CALCULATE", "FILTER"],
    answer: "CALCULATE"
  },
  {
    question: "Hàm tra cứu hiện đại thay thế VLOOKUP và có thể tìm kiếm dữ liệu từ phải sang trái?",
    options: ["HLOOKUP", "XLOOKUP", "INDEX", "LOOKUP"],
    answer: "XLOOKUP"
  }
];

let excelScore = 0;

function loadExcelQuiz() {
  const qEl = document.getElementById('excelQuizQuestion');
  const optEl = document.getElementById('excelQuizOptions');
  if (!qEl || !optEl) return;

  const currentQ = excelQuizData[Math.floor(Math.random() * excelQuizData.length)];
  qEl.innerText = currentQ.question;
  optEl.innerHTML = '';

  currentQ.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerText = opt;
    btn.onclick = () => {
      if (opt === currentQ.answer) {
        showToast("🎉 Chính xác! +10 điểm", "success");
        excelScore += 10;
        const scoreEl = document.getElementById('excelQuizScore');
        if (scoreEl) scoreEl.innerText = excelScore;
      } else {
        showToast(`❌ Chưa đúng rồi! Đáp án đúng là: ${currentQ.answer}`, "error");
      }
      loadExcelQuiz();
    };
    optEl.appendChild(btn);
  });
}

function loadExcelNotes() {
  const noteList = document.getElementById('excelNoteList');
  if (!noteList) return;

  const notes = JSON.parse(localStorage.getItem('excel_notes') || '[]');
  noteList.innerHTML = '';

  notes.forEach((note, index) => {
    noteList.innerHTML += `
      <li>
        <span>📌 ${note}</span>
        <button class="btn-delete-note" onclick="deleteExcelNote(${index})"><i class="fa-solid fa-trash"></i></button>
      </li>
    `;
  });
}

function addExcelNote() {
  const input = document.getElementById('excelNoteInput');
  if (!input || !input.value.trim()) {
    showToast('Hương ơi, nhập ghi chú Excel trước nhé!', 'warning');
    return;
  }

  const notes = JSON.parse(localStorage.getItem('excel_notes') || '[]');
  notes.push(input.value.trim());
  localStorage.setItem('excel_notes', JSON.stringify(notes));

  input.value = '';
  loadExcelNotes();
  showToast('📌 Đã lưu ghi chú Excel!', 'success');
}

function deleteExcelNote(index) {
  const notes = JSON.parse(localStorage.getItem('excel_notes') || '[]');
  notes.splice(index, 1);
  localStorage.setItem('excel_notes', JSON.stringify(notes));
  loadExcelNotes();
  showToast('🗑️ Đã xóa ghi chú Excel', 'info');
}

// 8. TỰ ĐỘNG KHỞI CHẠY TRANG
function initApp() {
  initThemeToggle();
  initDashboardHeader();
  initQuotes();
  initPomodoro();
  initNotesAndTasks();

  // Khởi chạy Excel nếu ở trang excel.html
  if (document.getElementById('excelPage')) {
    renderShortcuts(excelShortcuts);
    renderFormulas(excelFormulas);
    renderAdvanced(excelAdvanced);
    loadExcelQuiz();
    loadExcelNotes();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}