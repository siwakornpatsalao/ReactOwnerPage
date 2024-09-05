import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem, Button, Radio, RadioGroup} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from "sweetalert2";
import AddonAdd from 'src/components/addonAdd';
import OptionAdd from 'src/components/optionAdd';
import { useFormik } from "formik";
import * as Yup from "yup";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [editAmount, setEditAmount] = useState(0);
  const [unit, setUnit] = useState('');
  const [options, setOptions] = useState([]);
  const initial = useRef(false);
  const [optionGroupName, setOptionGroupName] = useState('');
  const [isRequired, setIsRequired] = useState(true);
  const [isRequired2, setIsRequired2] = useState(true);
  const [addons, setAddons] = useState([]);
  const [id, setId] = useState(0);
  const [id2, setId2] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image || isNameValid(name) || isPriceValid(price) || isAmountValid(amount) || isUnitValid(unit)) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
      return;
    }
    Swal.fire({
      title: "ต้องการเพิ่มเมนูเพิ่มเติมนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true,
      denyButtonText: "ยกเลิก", 
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`เพิ่มเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
        try {
          const response = await fetch('http://localhost:5000/addons', {
            method: 'POST',
            body: JSON.stringify({
              id: id+1,
              name: name,
              thumbnail: image,
              price: price,
              amount: amount,
              editAmount: editAmount,
              unit: unit,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to add new menu');
          }
          const resJson = await response.json();
          console.log(resJson);
          setImage(null);
          setName('');
          setPrice(0);
          setAmount(0);
          setUnit("");
          fetchAddons();
          document.getElementById('file-input').value = '';
        } catch (error) {
          console.log('Error:', error.message);
        }
      }})
  }

  function handleChangeFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
    };
  
    reader.readAsDataURL(file);
  }

  //---------------------------------------------------------------------------------------------------------

  const handleIsRequiredChange = (event) => {
    setIsRequired(event.target.value === 'necessary');
  };

  const handleIsRequiredChange2 = (event) => {
    setIsRequired2(event.target.value === 'one');
  };

  function handleAddOption(){
    Swal.fire({
      title: "เพิ่มตัวเลือก",
      html: '<input id="swal-input1" class="swal2-input" placeholder="ชื่อตัวเลือก">' +
      '<input id="swal-input2" class="swal2-input" placeholder="ราคา">',
      showDenyButton: true,
      confirmButtonText: "ยืนยัน",
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputName = document.getElementById('swal-input1').value;
        const inputPrice = document.getElementById('swal-input2').value;

        console.log(inputName)
        console.log(inputPrice)

      if (inputName !== "" && inputPrice !== "") {
        Swal.fire(`เพิ่ม Option แล้ว`, "", "success");
        const newOption = {
          name: inputName,
          price: inputPrice,
        };
        setOptions([...options, newOption]);
        console.log(options)
    
        //store in array
      }

    }});
  }

  function handleEditOption(option,index){
    const selectedOption = options[index];
    Swal.fire({
      title: "แก้ไขตัวเลือก",
      html: `<input id="swal-input1" class="swal2-input" placeholder="ชื่อตัวเลือก" value=${option.name}>` +
      `<input id="swal-input2" class="swal2-input" placeholder="ราคา" value=${option.price}>`,
      showDenyButton: true,
      confirmButtonText: "ยืนยัน",
      showCancelButton: true, 
      cancelButtonText: "ยกเลิก", 
      denyButtonText: `ลบตัวเลือก`,
      customClass: {
        content: "custom-swal-content", 
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const inputName = document.getElementById('swal-input1').value;
        const inputPrice = document.getElementById('swal-input2').value;

        console.log(inputName)
        console.log(inputPrice)

        if (inputName !== "" && inputPrice !== "") {
          Swal.fire(`แก้ไข Option แล้ว`, "", "success");
          const editOption = {
            ...selectedOption,
            name: inputName,
            price: inputPrice,
          };     
          const updatedOptions = [...options];
          updatedOptions[index] = editOption;
          setOptions(updatedOptions);
          console.log(options);
        }
      }else if(result.isDenied){
        Swal.fire("ตัวเลือกถูกลบ", "", "success");
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1); 
        setOptions(updatedOptions);
        console.log(options);
      }
  });
  }

  async function handleSubmitOption(e){
    e.preventDefault();
    if (isOptionGroupNameValid(optionGroupName)) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
      return;
    }
    Swal.fire({
      title: "ต้องการเพิ่มกลุ่มตัวเลือกนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true,
      denyButtonText: "ยกเลิก", 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(optionGroupName)
          const response = await fetch('http://localhost:5000/optiongroups', {
            method: 'POST',
            body: JSON.stringify({
              id: id2+1,
              name: optionGroupName,
              options: options,
              require: isRequired ? 'necessary' : 'not',
              selection: isRequired2 ? 'one' : 'many',
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to add new optionGroups');
          }
          Swal.fire(`เพิ่มกลุ่มตัวเลือกแล้ว`, "", "success");
          const resJson = await response.json();
          console.log(resJson);
          setOptionGroupName('');
          setOptions([]);
          fetchOptions();
        } catch (error) {
          console.log('Error:', error.message);
        }
      }})
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchAddons = async () => {
    try {
      const res = await fetch('http://localhost:5000/addons');
      const data = await res.json();
      setAddons(data);
      const maxId = data.reduce((max, item) => {
        return item.id > max ? item.id : max;
      }, 0);
      setId(maxId);
      console.log(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  }

  const fetchOptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/optiongroups');
      const data = await res.json();
      const maxId = data.reduce((max, item) => {
        return item.id > max ? item.id : max;
      }, 0);
      setId2(maxId);
      console.log(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  }

  useEffect(() => {
    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
    }
  }, []);

  useEffect(() => {
    fetchAddons();
    fetchOptions();
  }, [id, id2]);

  return (
    <DashboardLayout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab sx={{fontSize:'20px'}} label="เมนูเพิ่มเติม" {...a11yProps(0)} />
          <Tab sx={{fontSize:'20px'}} label="ตัวเลือก" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
      <AddonAdd/>
       {/* { <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex',marginLeft: '300px'  }}>
          <Box sx={{ m: 1 }}>
          <input
            id="file-input"
            type="file"
            onChange={handleChangeFile}
            accept="image/*"
          />
          <br/>
          <br/>
          {image && (
            <img
              src={image}
              style={{ maxWidth: '100%', height: '500px' }}
              alt="Preview"
            />
          )}
          </Box>

          <Box
            sx={{ '& > :not(style)': { m: 1, width: '25ch', marginLeft:'50px' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="ชื่อเมนู"
              value={name}
              color="secondary"

              helperText="กรุณาใส่ชื่อสินค้า"
              focused
              onChange={(e) => setName(e.target.value)}
            />
            <br/>
            <TextField
              label="ราคา"
              value={price}
              color="secondary"

              helperText="ราคาควรมีค่า 0 ขึ้นไป"
              focused
              onChange={(e) => setPrice(e.target.value)}
            />
            <br/>
            <TextField
              label="จำนวน"
              value={amount}
              color="secondary"

              helperText="จำนวนควรมีค่า 0 ขึ้นไป"
              focused
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              label="แก้ไขจำนวน"
              disabled
              value={editAmount}
              color="secondary"
              focused
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <br/>
            <TextField
              label="หน่วย"
              value={unit}
              color="secondary"

              helperText="กรุณาใส่หน่วย"
              focused
              onChange={(e) => setUnit(e.target.value)}
            />
          <br/>

          <Button variant="contained" type="submit">สร้างเมนูเพิ่มเติมใหม่</Button>
          </Box>
        </Box>
        </form> } */}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <OptionAdd/>
        {/* <form onSubmit={handleSubmitOption}>
          <Box sx={{display:'flex',marginLeft: '400px' }}>   
          <Box sx={{ m: 1 }}>
        <h1>ชื่อกลุ่มตัวเลือก</h1>
        <TextField
              label="ชื่อกลุ่มตัวเลือก"
              value={optionGroupName}
              color="secondary"

              helperText="กรุณาชื่อกลุ่มตัวเลือก"
              focused
              onChange={(e) => setOptionGroupName(e.target.value)}
        />
        <br/>
        <Button onClick={handleAddOption}>เพิ่มตัวเลือก</Button>
        {options.map((option,index) => (
              <MenuItem onClick={() => handleEditOption(option,index)} key={option._id}>
                {option.name} +{option.price} บาท
              </MenuItem>
            ))}
        <h1>ลูกค้าต้องเลือกตัวเลือกนี้หรือไม่</h1>
        <RadioGroup value={isRequired ? 'necessary' : 'not'} onChange={handleIsRequiredChange}>
          <FormControlLabel value="necessary" control={<Radio />} label="จำเป็น" />
          <FormControlLabel value="not" control={<Radio />} label="ไม่บังคับ" />
        </RadioGroup>
        <h1>ลูกค้าสามารถเลือกตัวเลือกได้กี่อย่าง</h1>
        <RadioGroup value={isRequired2 ? 'one' : 'many'} onChange={handleIsRequiredChange2}>
          <FormControlLabel value="one" control={<Radio />} label="1 อย่าง" />
          <FormControlLabel value="many" control={<Radio />} label="หลายอย่าง" />
        </RadioGroup>
        <br/>

        <Button variant='contained' type="submit">สร้างตัวเลือกใหม่</Button>
        </Box>
        </Box>
        </form> */}
      </CustomTabPanel>
    </Box>
    </DashboardLayout>
  );
}
