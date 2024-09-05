import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem, Button, Radio, RadioGroup, Card, CardContent} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from "sweetalert2";
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const disabledTabStyle = {
  pointerEvents: 'none',
  opacity: 0.5,
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
  const initial = useRef(false);
  const [optionGroupName, setOptionGroupName] = useState('');
  const [options, setOptions] = useState([]);
  const [isRequired, setIsRequired] = useState(true);
  const [isRequired2, setIsRequired2] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [addon, setAddon] = useState([]);
  const [optionGroup, setOptionGroup] = useState([]);

  const isNameValid = (name) => name == "";
  const isPriceValid = (price) => price<=0;
  const isEditAmountValid = (editAmount) => editAmount<0;
  const isUnitValid = (unit) => unit =="";

  const isOptionGroupNameValid = (optionGroupName) => optionGroupName == "";


  async function handleSubmit(e) {
    e.preventDefault();
    if (!image || isNameValid(name) || isPriceValid(price) || isEditAmountValid(editAmount) || isUnitValid(unit)) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
      return;
    }
    Swal.fire({
      title: "ยืนยันการแก้ไขเมนูเพิ่มเติมนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`แก้ไขเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/addons/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: name,
              thumbnail: image,
              price: price,
              amount: parseInt(amount) + parseInt(editAmount),
              editAmount: editAmount,
              unit: unit,
              updated_at: new Date().toISOString(),
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
          document.getElementById('file-input').value = '';
        } catch (error) {
          console.log('Error:', error.message);
        }
      }})
  }

  async function handleDeleteAddon(e) {
    e.preventDefault();
    Swal.fire({
      title: "ต้องการลบเมนูเพิ่มเติมนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`ลบเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/addons/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete this addons");
          }
          setImage(null);
          setName('');
          setPrice(0);
          setAmount('');
          setEditAmount('');
          setUnit('');
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
    })
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
      title: "ยืนยันการแก้ไขกลุ่มตัวเลือกนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`แก้ไขกลุ่มตัวเลือกนี้แล้ว`, "", "success");
        try {
          console.log(optionGroupName)
          const response = await fetch(`http://localhost:5000/optiongroups/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: optionGroupName,
              options: options,
              require: isRequired ? 'necessary' : 'not',
              selection: isRequired2 ? 'one' : 'many',
              updated_at: new Date().toISOString(),
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to add new optionGroups');
          }
          const resJson = await response.json();
          console.log(resJson);
        } catch (error) {
          console.log('Error:', error.message);
        }
      }
    })
  }

  async function handleDeleteOption(e) {
    e.preventDefault();
    Swal.fire({
      title: "ต้องการลบกลุ่มตัวเลือกนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true,
      denyButtonText: "ยกเลิก", 
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`ลบกลุ่มตัวเลือกนี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/optiongroups/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete this optiongroups");
          }
          setOptionGroupName('');
          setOptions([]);
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
    })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {

    if (id) {
      fetchAddonData();
      fetchOptionGroup();
    }
    
    //if from addon do fetchAddonData **BUT** if from option do fetchOptionGroup
    
    async function fetchAddonData(){
        try {
          const response = await fetch(`http://localhost:5000/addons/${id}`);
          const data = await response.json();
          setAddon(data);
          setName(data.name);
          setPrice(data.price);
          setAmount(data.amount);
          setEditAmount(data.editAmount);
          setImage(data.thumbnail);
          setUnit(data.unit);

          if(data.price==''){
            setValue(1);
            //disable addon tab
          }else if(data.price!=''){
            setValue(0);
            //disable optiongroup tab
          }
          console.log(data)
        } catch (error) {
          console.error('Error fetching menu:', error);
        }
      };

    async function fetchOptionGroup() {
      try {
        const res = await fetch(`http://localhost:5000/optiongroups/${id}`);
        const data = await res.json();
        setOptionGroup(data);
        setOptionGroupName(data.name);
        setOptions(data.options);
        console.log(data);

        if(data.options!=[]){
          setValue(1);
          //disable addon tab
        }else if(data.options==[]){
          setValue(0);
          //disable optiongroup tab
        }
        console.log(data)
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
    }
  }, [id]);

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
          <Tab sx={{fontSize:'20px'}} style={!name ? disabledTabStyle : {}} label="เมนูเพิ่มเติม" {...a11yProps(0)} />
          <Tab sx={{fontSize:'20px'}} style={!optionGroupName ? disabledTabStyle : {}} label="ตัวเลือก" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <form onSubmit={handleSubmit}>
        <br/>
        <Box sx={{ display: 'flex' }}>
          <Grid container
            justifyContent="space-evenly"
            alignItems="flex-start"  
            rowSpacing={1} 
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Box sx={{ m: 1 }}>
          <label htmlFor="upload-photo">
                {image ? (
                  <img
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                    src={image}
                    alt="Preview"
                    variant="square"
                    width="600px"
                  />
                ) : (
                  <AddPhotoAlternateIcon
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      color: '#DCD9D8', 
                      width: "400px",
                      cursor: 'pointer',
                    }}
                  />
                )}
              </label>
              <input
                style={{ display: 'none' }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                onChange={handleChangeFile}
                accept="image/*"
              />
          </Box>
          </Grid>

          <Grid container
            justifyContent="space-evenly"
            alignItems="flex-start"  
            rowSpacing={1} 
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Box
            sx={{ '& > :not(style)': { m: 3 } }}
            noValidate
            autoComplete="off"
          >
            <Item>
            <TextField
              inputProps={{style: {fontSize: 25}}}
              InputLabelProps={{style: {fontSize: 20}}}
              fullWidth
              label="ชื่อเมนู"
              value={name}
              color="secondary"
              error={isNameValid(name)}
              helperText="กรุณาใส่ชื่อสินค้า"
              focused
              onChange={(e) => setName(e.target.value)}
            />
            </Item>

            <Box sx={{ display: 'flex',flexWrap: 'wrap'}}>
            <Item>
            <TextField
              inputProps={{style: {fontSize: 24}}}
              InputLabelProps={{style: {fontSize: 20}}}
              label="ราคา"
              value={price}
              color="secondary"
              error={isPriceValid(price)}
              helperText="ราคาควรมีค่า 0 ขึ้นไป"
              focused
              onChange={(e) => setPrice(e.target.value)}
            />
            </Item>
            <Item>
            <TextField
              inputProps={{style: {fontSize: 24}}}
              InputLabelProps={{style: {fontSize: 20}}}
              label="หน่วย"
              value={unit}
              color="secondary"
              error={isUnitValid(unit)}
              helperText="กรุณาใส่หน่วย"
              focused
              onChange={(e) => setUnit(e.target.value)}
            />
            </Item>
            </Box>

            <Box sx={{ display: 'flex',flexWrap: 'wrap'}}>
            <Item>
            <TextField
              inputProps={{style: {fontSize: 24}}}
              InputLabelProps={{style: {fontSize: 20}}}
              label="จำนวน"
              value={amount}
              color="secondary"
              disabled
              focused
              onChange={(e) => setAmount(e.target.value)}
            />
            </Item>
            <Item>
            <TextField
              inputProps={{style: {fontSize: 24}}}
              InputLabelProps={{style: {fontSize: 20}}}
              label="แก้ไขจำนวน"
              value={editAmount}
              color="secondary"
              error={isEditAmountValid(editAmount)}
              helperText="จำนวนที่แก้ไขควรมีค่า 0 ขึ้นไป"
              focused
              onChange={(e) => setEditAmount(e.target.value)}
            />
            </Item>
            </Box>
          <Item>
          <Button style={{fontSize:25}} fullWidth variant="contained" type="submit">แก้ไขเมนูเพิ่มเติม</Button>
          </Item>
          {/* <Item>
            <Button
              style={{fontSize:25}}
              fullWidth
              variant="contained"
              type="button"
              onClick={() => {
                Swal.fire({
                  title: "ตัวอย่าง",
                  html: `
                   <style>
                     .content {
                       text-align: left;
                      }
                    .price {
                      color: red;
                      }
                  </style>
                  <div class="content">
                <img src="${image}" alt="Preview" style="max-width: 100%; height: auto;" />
                  <p style="font-size: 28px;"><strong>ชื่อเมนูเพิ่มเติม:</strong> ${name}</p>
                  <p style="font-size: 28px;"><strong>ราคา: <span class="price">${price}</span></strong></p>
                 `,
                  showCloseButton: true,
                  showConfirmButton: false,
                });
              }}
            >
              ตัวอย่าง
            </Button>
            </Item> */}
            <Item>
            <Button fullWidth style={{ background: 'red',fontSize:25 }} variant="contained" onClick={handleDeleteAddon}>ลบเมนูเพิ่มเติมชิ้นนี้</Button>
            </Item>
          </Box>
          </Grid>
        </Box>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <form onSubmit={handleSubmitOption}>
        <Box sx={{display:'flex' }}>   
        <Grid container
            justifyContent="space-evenly"
            alignItems="flex-start"  
            rowSpacing={1} 
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Card sx={{display: 'flex',
                      flexDirection: 'column',
                      height: '100%'}}> 
            <CardContent>
        <Box sx={{ m: 1 }}>
        <Typography variant="h4" component="h4">
              ชื่อกลุ่มตัวเลือก
        </Typography>
        <br/>
        <TextField
            inputProps={{style: {fontSize: 25}}}
            InputLabelProps={{style: {fontSize: 20}}}
            fullWidth
            label="ชื่อกลุ่มตัวเลือก"
            value={optionGroupName}
            color="secondary"
            error={isOptionGroupNameValid(optionGroupName)}
            helperText="กรุณาใส่ชื่อกลุ่มตัวเลือก"
            focused
            onChange={(e) => setOptionGroupName(e.target.value)}
        />
        <br/>
        <Button sx={{fontSize: 22}} onClick={handleAddOption}>เพิ่มตัวเลือก</Button>
        {/* If edit addon disable */}
        {options.map((option,index) => (
              <MenuItem onClick={() => handleEditOption(option,index)} key={option._id}>
                <span style={{color:'grey', fontSize:20}}>{option.name} +{option.price} บาท</span>
              </MenuItem>
            ))}
        <br/>
        <br/>
        <Typography variant="h4" component="h4">
            ลูกค้าต้องเลือกตัวเลือกนี้หรือไม่
        </Typography>
        <br/>
        <RadioGroup value={isRequired ? 'necessary' : 'not'} onChange={handleIsRequiredChange}>
          <FormControlLabel value="necessary" control={<Radio />} label={<Typography variant="h6" component="h6" style={{ color: "black", fontWeight: "normal",fontSize:24 }}>
                            จำเป็น
                        </Typography>} />
          <FormControlLabel value="not" control={<Radio />} label={<Typography variant="h6" component="h6" style={{ color: "black", fontWeight: "normal",fontSize:24 }}>
                            ไม่บังคับ
                        </Typography>} />
        </RadioGroup>
        <Typography variant="h4" component="h4">
            ลูกค้าสามารถเลือกตัวเลือกได้กี่อย่าง
        </Typography>
        <br/>
        <RadioGroup value={isRequired2 ? 'one' : 'many'} onChange={handleIsRequiredChange2}>
          <FormControlLabel value="one" control={<Radio />} label={<Typography variant="h6" component="h6" style={{ color: "black", fontWeight: "normal",fontSize:24 }}>
                            1 อย่าง
                        </Typography>} />
          <FormControlLabel value="many" control={<Radio />} label={<Typography variant="h6" component="h6" style={{ color: "black", fontWeight: "normal",fontSize:24 }}>
                            หลายอย่าง
                        </Typography>}/>
        </RadioGroup>
        <br/>

        <Button sx={{fontSize: 20}} fullWidth variant='contained' type="submit">แก้ไขกลุ่มตัวเลือก</Button>
        <br/><br/>
        <Button sx={{fontSize:20}} fullWidth style={{ background: 'red' }} variant="contained" onClick={handleDeleteOption}>ลบกลุ่มตัวเลือก</Button>
        </Box>
        </CardContent>
        </Card>
        </Grid>
        </Box>
        </form>
      </CustomTabPanel>
    </Box>
    </DashboardLayout>
  );
}