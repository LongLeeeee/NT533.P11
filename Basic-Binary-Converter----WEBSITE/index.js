const decimalInput = document.getElementById("decimal");
const binaryInput = document.getElementById("binary");
const hexInput = document.getElementById("hex");

const submitBtn = document.getElementById("submitbtn");
const resetBtn = document.getElementById("resetbtn");

/*
// tạo OpenWhisk Action //
function main(params) {
  const input = params.input;
  const from = params.from;
  const to = params.to;

  let decimalVal;
  try {
      switch (from) {
          case "decimal":
              decimalVal = parseInt(input, 10);
              break;
          case "binary":
              decimalVal = parseInt(input, 2);
              break;
          case "hex":
              decimalVal = parseInt(input, 16);
              break;
          case "octal":
              decimalVal = parseInt(input, 8);
              break;
          default:
              return { result: "Invalid 'from' system." };
      }

      if (isNaN(decimalVal)) return { result: "Invalid input number." };

      let result;
      switch (to) {
          case "decimal":
              result = decimalVal.toString(10);
              break;
          case "binary":
              result = decimalVal.toString(2);
              break;
          case "hex":
              result = decimalVal.toString(16).toUpperCase();
              break;
          case "octal":
              result = decimalVal.toString(8);
              break;
          default:
              result = "Invalid 'to' system.";
      }

      return { result };
  } catch (e) {
      return { result: "Error: " + e.message };
  }
}

document.getElementById("submitbtn").addEventListener("click", function () {
  const inputVal = document.getElementById("input").value.trim();
  const fromIndex = document.querySelectorAll("select")[0].value;
  const toIndex = document.querySelectorAll("select")[1].value;

  const systemMap = {
      "1": "decimal",
      "2": "binary",
      "3": "hex",
      "4": "octal"
  };

  const fromSystem = systemMap[fromIndex];
  const toSystem = systemMap[toIndex];

  if (!fromSystem || !toSystem || !inputVal) {
      alert("Vui lòng nhập dữ liệu hợp lệ và chọn hệ thống!");
      return;
  }

  const requestData = {
      input: inputVal,
      from: fromSystem,
      to: toSystem
  };

  fetch("https://us-south.functions.appdomain.cloud/api/v1/web/username_namespace/default/convertNumber.json", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
  })
      .then(response => {
          if (!response.ok) {
              throw new Error("Lỗi khi gọi API.");
          }
          return response.json();
      })
      .then(data => {
          document.getElementById("Output").value = data.result || "Không có kết quả!";
      })
      .catch(error => {
          console.error("Lỗi:", error);
          alert("Đã xảy ra lỗi khi chuyển đổi.");
      });
});

// Nút reset
document.getElementById("resetbtn").addEventListener("click", function () {
  document.getElementById("input").value = "";
  document.getElementById("Output").value = "";
});
*/



// ---------------------------Code Giao Diện mới hoạt động độc lập----------------------------
document.getElementById("submitbtn").addEventListener("click", function () {
    const fromBase = document.querySelectorAll("select")[0].value;
    const toBase = document.querySelectorAll("select")[1].value;
    const inputValue = document.getElementById("input").value.trim();
    const outputField = document.getElementById("Output");
  
    // Kiểm tra đầu vào
    if (inputValue === "") {
      outputField.value = "Vui lòng nhập giá trị!";
      return;
    }
  
    // Chuyển text sang số ở base nguồn
    let decimalValue;
    try {
      switch (fromBase) {
        case "1": // Decimal
          decimalValue = parseInt(inputValue, 10);
          break;
        case "2": // Binary
          decimalValue = parseInt(inputValue, 2);
          break;
        case "3": // Hex
          decimalValue = parseInt(inputValue, 16);
          break;
        case "4": // Octal
          decimalValue = parseInt(inputValue, 8);
          break;
        default:
          outputField.value = "Chọn hệ số hợp lệ!";
          return;
      }
  
      // Nếu không phải số hợp lệ
      if (isNaN(decimalValue)) {
        outputField.value = "Giá trị không hợp lệ!";
        return;
      }
  
      // Chuyển đổi sang base đích
      let result;
      switch (toBase) {
        case "1":
          result = decimalValue.toString(10);
          break;
        case "2":
          result = decimalValue.toString(2);
          break;
        case "3":
          result = decimalValue.toString(16).toUpperCase();
          break;
        case "4":
          result = decimalValue.toString(8);
          break;
        default:
          result = "Chọn hệ số hợp lệ!";
      }
  
      outputField.value = result;
  
    } catch (err) {
      outputField.value = "Lỗi chuyển đổi!";
    }
  });
  
  // Nút reset
  document.getElementById("resetbtn").addEventListener("click", function () {
    document.getElementById("input").value = "";
    document.getElementById("Output").value = "";
  });


  

/*//---------------------------Code Giao Diện cũ hoạt động độc lập----------------------------
// Hàm Submit tính toán
submitBtn.addEventListener("click", function () {
    const decimalValue = parseInt(decimalInput.value);

    if (!isNaN(decimalValue)) {
        let binarynumb = decimalValue.toString(2); // Nhị phân
        let hexnumb = decimalValue.toString(16).toUpperCase(); // Hex, in hoa

        binaryInput.value = binarynumb;
        hexInput.value = hexnumb;
    } else {
        binaryInput.value = "";
        hexInput.value = "";
        alert("Vui lòng nhập một số thập phân hợp lệ!");
    }
});

//Hàm Reset
function reset() {
    decimalInput.value = "";
    binaryInput.value = "";
    hexInput.value = "";
}

resetBtn.addEventListener("click", function(){
reset();

});
*/
