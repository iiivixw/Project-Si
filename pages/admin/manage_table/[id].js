// pages/edit_table/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert

const EditTable = () => {
    const router = useRouter();
    const { id } = router.query; // ดึง ID จากพารามิเตอร์ใน URL
    const [table, setTable] = useState({ table_number: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchTable = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/tables/${id}`);
                    if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ');
                    const data = await response.json();
                    setTable(data); // ตั้งค่า table_number ที่ดึงมา
                } catch (error) {
                    setError(error.message);
                }
            };
            fetchTable();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTable((prevTable) => ({ ...prevTable, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:5000/api/tables/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ table_number: table.table_number }), // Only send the table number
          });
      
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
      
          Swal.fire('สำเร็จ!', 'ข้อมูลโต๊ะได้ถูกบันทึกเรียบร้อยแล้ว.', 'success').then(() => {
            router.push('/admin/all_table');
          });
        } catch (error) {
          setError(error.message);
          Swal.fire('เกิดข้อผิดพลาด!', error.message, 'error');
        }
      };      
    return (
        <div className="container mt-5">
            <h1 className="text-center">แก้ไขข้อมูลโต๊ะ</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="table_number" className="form-label">หมายเลขโต๊ะ</label>
                    <input
                        type="text"
                        className="form-control"
                        id="table_number"
                        name="table_number"
                        value={table.table_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">บันทึก</button>
            </form>
        </div>
    );
};

export default EditTable;
