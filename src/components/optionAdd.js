import * as React from 'react';
import Box from '@mui/material/Box';
import { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem, Button, Radio, RadioGroup, Card, CardContent} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";

export default function OptionAdd(){
    const [options, setOptions] = useState([]);
    const [optionGroupName, setOptionGroupName] = useState('');
    const [isRequired, setIsRequired] = useState(true);
    const [isRequired2, setIsRequired2] = useState(true);
    const [id2, setId2] = useState(0);
    const initial = useRef(false);

    const isOptionGroupNameValid = (optionGroupName) => optionGroupName == "";

    const validationSchema = Yup.object().shape({
      optionGroupName: Yup.string().required('กรุณาใส่ชื่อสินค้า'),
    });

    const formik = useFormik({
      initialValues: {
        optionGroupName:'',
      },
      validationSchema,
      onSubmit: async (values) => {

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
                  name: values.optionGroupName,
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
              formik.resetForm();
              setOptions([]);
              fetchOptions();
            } catch (error) {
              console.log('Error:', error.message);
            }
          }})
      }
    })

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
        fetchOptions();
      }, [id2]);

    return(
      <div>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box sx={{display:'flex'}}>
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
           InputLabelProps={{style: {fontSize: 25}}}
           focused
           fullWidth
           label="ชื่อกลุ่มตัวเลือก"
           name="optionGroupName"
           onBlur={formik.handleBlur}
           onChange={formik.handleChange}
           value={formik.values.optionGroupName}
           error={formik.touched.optionGroupName && !!formik.errors.optionGroupName}
           helperText={formik.touched.optionGroupName && formik.errors.optionGroupName}
        />
        <br/>
        <Button sx={{fontSize: 22}} onClick={handleAddOption}>เพิ่มตัวเลือก</Button>
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
        <br/>
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
                        </Typography>} />
        </RadioGroup>
        <br/>

        <Button sx={{fontSize: 20}} fullWidth variant='contained' type="submit">สร้างตัวเลือกใหม่</Button>
        </Box>
        </CardContent>
        </Card>
        </Grid>
        </Box>
        </form>
        </div>
    )
}