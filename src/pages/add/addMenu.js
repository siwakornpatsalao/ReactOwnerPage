import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import { TextField, MenuItem, Button, Card, CardContent } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <>
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
    </>
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const initial = useRef(false);
  const [addons, setAddons] = useState([]);
  const [optionGroups, setOptionGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedOptionGroups, setSelectedOptionGroups] = useState([]);
  const [menus, setMenus] = useState([]);
  const [id, setId] = useState(0);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("กรุณาใส่ชื่อสินค้า"),
    price: Yup.number().positive("กรุณาใส่ราคาที่มากกว่า 0").required("กรุณาใส่ราคา"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const addonIds = selectedAddons;
      const optionGroupIds = selectedOptionGroups;

      if (!image || !category) {
        Swal.fire("Error", "กรุณาใส่ข้อมูล", "error");
        return;
      }

      Swal.fire({
        title: "ต้องการเพิ่มสินค้านี้หรือไม่",
        confirmButtonText: "ยืนยัน",
        showDenyButton: true,
        denyButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("Submitting form...");
          try {
            const response = await fetch("http://localhost:5000/menus", {
              method: "POST",
              body: JSON.stringify({
                id: id + 1,
                name: values.name,
                thumbnail: image,
                description: values.description,
                price: values.price,
                category: category,
                addonId: addonIds,
                optionGroupId: optionGroupIds,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              Swal.fire(`ไม่สามารถเพิ่มเมนูได้`, "", "error");
              throw new Error("Failed to add new menu");
            }
            const resJson = await response.json();
            console.log(resJson);
            Swal.fire(`เพิ่มสินค้าชิ้นนี้แล้ว`, "", "success");
            formik.resetForm();
            setImage(null);
            setCategory("");
            setSelectedAddons([]);
            setSelectedOptionGroups([]);
            document.getElementById("file-input").value = "";
          } catch (error) {
            console.log("Error:", error.message);
          }
        }
      });
    },
  });

  function handleChangeFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (!file) {
      return;
    }

    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
    };

    reader.readAsDataURL(file);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch("http://localhost:5000/menus");
      const data = await res.json();
      setMenus(data);
      const maxId = data.reduce((max, item) => {
        return item.id > max ? item.id : max;
      }, 0);
      setId(maxId);
      console.log(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    async function fetchData(url, setter) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setter(data);
        console.log(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    }

    if (!categories.length) {
      fetchData("http://localhost:5000/addons", setAddons);
      fetchData("http://localhost:5000/optiongroups", setOptionGroups);
      fetchData("http://localhost:5000/category", setCategories);
      fetchMenus();
    }

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [id]);

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab sx={{fontSize:'25px'}} label="เมนูหลัก" {...a11yProps(0)} />
            <Tab sx={{fontSize:'25px'}} label="ส่วนเสริม" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                display: "flex",
                marginTop: {
                  xs: "30px",
                  sm: "40px",
                  md: "50px",
                  lg: "60px",
                  xl: "70px",
                },
              }}
            >
              <Grid
                container
                justifyContent="space-evenly"
                alignItems="flex-start"
                spacing={3}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Box sx={{ m: 1 }}>
                  <label htmlFor="upload-photo">
                    {image ? (
                      <img
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                        src={image}
                        alt="Preview"
                        variant="square"
                        width="600px"
                      />
                    ) : (
                      <AddPhotoAlternateIcon
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          color: "#DCD9D8",
                          width: "400px",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </label>
                  <input
                    style={{ display: "none" }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={handleChangeFile}
                    accept="image/*"
                  />
                </Box>
              </Grid>

              <Grid
                container
                justifyContent="space-evenly"
                alignItems="flex-start"
                spacing={3}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Box
                  sx={{
                    "& > :not(style)": { m: 3 },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Item>
                    <TextField
                      inputProps={{style: {fontSize: 25}}}
                      InputLabelProps={{style: {fontSize: 20}}}
                      fullWidth
                      focused
                      label="ชื่อสินค้า"
                      name="name"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.name}
                      error={formik.touched.name && !!formik.errors.name}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Item>
                  <Item>
                    <TextField
                      inputProps={{style: {fontSize: 25}}}
                      InputLabelProps={{style: {fontSize: 20}}}
                      fullWidth
                      focused
                      label="คำอธิบาย"
                      name="description"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.description}
                      error={formik.touched.description && !!formik.errors.description}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Item>

                  <Box sx={{ display: 'flex',flexWrap: 'wrap'}}>
                  <Item>
                  <TextField
                    inputProps={{style: {fontSize: 25}}}
                    InputLabelProps={{style: {fontSize: 20}}}
                    focused
                    label="ราคา"
                    name="price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                    error={formik.touched.price && !!formik.errors.price}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                  </Item>
                  
                  <Item>
                  <TextField
                    inputProps={{style: {fontSize: 25}}}
                    InputLabelProps={{style: {fontSize: 20}}}
                    value={category}
                    select
                    focused
                    label="หมวดหมู่"
                    defaultValue="เครื่องดื่ม"
                    helperText="Please select your category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        <span style={{fontSize:20}}>{option.name}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  </Item>
                  </Box>
                  
                  <Item>
                  <Button sx={{fontSize:25}} fullWidth variant="contained" type="submit">
                    สร้างเมนูใหม่
                  </Button>
                  </Item>
                  <Item>
                  <Button
                    sx={{fontSize:25}}
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
                          <p><strong>ชื่อเมนู:</strong> ${formik.values.name}</p>
                          <p><strong>คำอธิบาย:</strong> ${formik.values.description}</p>
                          <p><strong>ราคา: <span class="price">${formik.values.price}</span></strong></p>
                        </div>
                      `,
                        showCloseButton: true,
                        showConfirmButton: false,
                      });
                    }}
                  >
                    ตัวอย่าง
                  </Button>
                  </Item>
                </Box>
              </Grid>
            </Box>
          </form>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              display: "flex",
              marginTop: {
                xs: "30px",
                sm: "40px",
                md: "50px",
                lg: "60px",
                xl: "70px",
              },
            }}
          >
            <Grid
              container
              justifyContent="space-evenly"
              alignItems="flex-start"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <div style={{ width: "500px" }}>
                <Card style={{backgroundColor:'white',boxShadow: ' 2px 9px #EADDCD',}}  sx={{ display: "flex", flexDirection: "column", height: "100%",border: '1px solid #ccc'  }}>
                  <CardContent>
                    <Grid item xs={6} md={10} sm={14}>
                      <Typography variant="h4" component="h4">
                        เมนูเพิ่มเติม
                      </Typography>
                      <br />
                      {addons.map((addon) => (
                        <FormGroup key={addon._id}>
                          <FormControlLabel
                            label={
                              <Typography  
                                style={{fontSize:26 }}
                              >
                                {addon.name}
                              </Typography>
                            }
                            control={
                              <Checkbox
                                checked={selectedAddons.includes(addon._id)}
                                onChange={() =>
                                  setSelectedAddons((prev) =>
                                    prev.includes(addon._id)
                                      ? prev.filter((id) => id !== addon._id)
                                      : [...prev, addon._id]
                                  )
                                }
                              />
                            }
                          />
                        </FormGroup>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </div>

              <Card style={{backgroundColor:'white',boxShadow: ' 2px 9px #EADDCD',}} sx={{ display: "flex", flexDirection: "column", height: "100%",border: '1px solid #ccc'  }}>
                <CardContent>
                  <div style={{ width: "500px" }}>
                    <Grid item xs={6} md={15} sm={14}>
                      <Typography variant="h4" component="h4">
                        ตัวเลือก
                      </Typography>
                      <br />
                      {optionGroups.map((optionGroup) => (
                        <FormGroup key={optionGroup._id}>
                          <FormControlLabel
                            label={
                              <Typography
                                style={{ fontSize:26 }}
                              >
                                {optionGroup.name}
                              </Typography>
                            }
                            control={
                              <Checkbox
                                checked={selectedOptionGroups.includes(optionGroup._id)}
                                onChange={() =>
                                  setSelectedOptionGroups((prev) =>
                                    prev.includes(optionGroup._id)
                                      ? prev.filter((id) => id !== optionGroup._id)
                                      : [...prev, optionGroup._id]
                                  )
                                }
                              />
                            }
                          />
                        </FormGroup>
                      ))}
                    </Grid>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Box>
        </CustomTabPanel>
      </Box>
    </DashboardLayout>
  );
}
