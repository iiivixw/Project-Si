import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function Home() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [menuCategories, setMenuCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchMenuItems();
      await fetchTables();
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://172.20.10.3:5000/api/categories');
      setCategories(response.data);
      if (response.data.length > 0) {
        setActiveCategory(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://172.20.10.3:5000/api/menu");
      setMenuCategories(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      alert("ไม่สามารถโหลดข้อมูลเมนูอาหารได้");
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://172.20.10.3:5000/api/tables");
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert("ไม่สามารถโหลดข้อมูลโต๊ะได้");
    }
  };

  const handleSelect = (category, item) => {
    const quantity = Number(document.getElementById(`quantity-${item.id}`).value);
    
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      alert("กรุณาใส่จำนวนที่ถูกต้อง");
      return;
    }

    const currentQuantity = selectedItems.reduce((total, selectedItem) => {
      if (
        selectedItem.name === "เนื้อวัว" ||
        selectedItem.name === "เนื้อหมู" ||
        selectedItem.name === "อาหารทะเล" ||
        selectedItem.name === "ผักและผลไม้" ||
        selectedItem.name === "ของทานเล่น"
      ) {
        return total + selectedItem.quantity;
      }
      return total;
    }, 0);

    if (currentQuantity + quantity > 3) {
      alert("คุณไม่สามารถสั่งได้เกิน 3 ถาดสำหรับเนื้อวัว, เนื้อหมู, อาหารทะเล, ผักและผลไม้ และของทานเล่น");
      return;
    }

    const newItem = { category, name: item.name, quantity };
    setSelectedItems(prevItems => [...prevItems, newItem]);
  };

  const handleOrder = async () => {
    const orderData = { tableNumber, items: selectedItems };

    try {
      await axios.post("http://172.20.10.3:5000/api/orders", orderData);
      alert("สั่งอาหารเรียบร้อยแล้ว!");
      setSelectedItems([]);
      setShowModal(false);
      setTableNumber("");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("เกิดข้อผิดพลาดในการสั่งอาหาร");
    }
  };

  const handleShowModal = () => {
    if (!tableNumber) {
      alert("กรุณากรอกหมายเลขโต๊ะก่อนสั่ง");
    } else if (selectedItems.length === 0) {
      alert("กรุณาเลือกอาหารอย่างน้อย 1 รายการ");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div
      className="container text-center"
      style={{ backgroundColor: "#C8E6B2", minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column" }} // Added flex properties
    >
      <div className="mt-3">
        <h1 className="mb-3">สั่งอาหาร</h1>
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>
                    <label className="form-label text-danger">
                      <strong>หมายเลขโต๊ะ :</strong>
                    </label>
                  </td>
                  <td>
                    <select
                      className="form-control w-100"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    >
                      <option value="">เลือกหมายเลขโต๊ะ</option>
                      {tables.map((table) => (
                        <option key={table.id} value={table.table_number}>
                          โต๊ะ {table.table_number}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex overflow-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn btn-outline-primary me-2 ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <table className="table table-responsive align-middle">
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อเมนู</th>
                <th>ราคา(บาท)</th>
                <th>จำนวน</th>
                <th>บันทึก</th>
              </tr>
            </thead>
            <tbody>
              {menuCategories.filter(item => item.category_id === activeCategory).length > 0 ? (
                menuCategories.filter(item => item.category_id === activeCategory).map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={{ width: "80px" }} />
                      ) : (
                        "ไม่มีรูปภาพ"
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>
                      <input
                        type="number"
                        id={`quantity-${item.id}`}
                        min="1"
                        defaultValue="1"
                        className="form-control"
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSelect(activeCategory, item)}
                      >
                        บันทึก
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">ไม่มีข้อมูลเมนู</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="selected-items mt-4">
          <h3>รายการที่เลือก:</h3>
          <ul className="list-group">
            {selectedItems.map((item, index) => (
              <li className="list-group-item" key={index}>
                {item.category}: {item.name} - {item.quantity} ถาด
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedItems.length > 0 && (
        <button className="btn btn-success mt-3" onClick={handleShowModal}>
          สั่งอาหาร
        </button>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการสั่งอาหาร</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>หมายเลขโต๊ะ: {tableNumber}</h5>
          <ul className="list-group">
            {selectedItems.map((item, index) => (
              <li className="list-group-item" key={index}>
                {item.category}: {item.name} - {item.quantity} ถาด
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleOrder}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
