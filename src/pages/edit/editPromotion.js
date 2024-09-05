import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField, MenuItem, Button, Radio, RadioGroup} from '@mui/material';
import { useState, useEffect, useRef} from 'react';
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Swal from "sweetalert2";
import { useRouter } from 'next/router';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const steps = ['เลือกรูปแบบโปรโมชั่น', 'เพิ่มรายละเอียดโปรโมชั่น', 'ตัวอย่างโปรโมชั่น'];
const daysOfWeek = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัส', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'];

function Step1({setType,type,setProductType,productType}) {

    const handleSelectedChange = (event) => {
      setType(event.target.value)
    };

    const handleSelected2Change = (event) => {
        setProductType(event.target.value)
      };
  
    return (
      <div>
        <h1>เลือกรูปแบบโปรโมชั่น</h1>
        <RadioGroup value={type} onChange={handleSelectedChange} >
          <FormControlLabel value="percent" control={<Radio />} label="เปอร์เซ็นต์" />
          <FormControlLabel value="specific" control={<Radio />} label="ราคาแบบเจาะจง" />
          <FormControlLabel value="free" control={<Radio />} label="เมนูแถมฟรี" />
        </RadioGroup>

        <h1>เลือกรูปแบบโปรโมชั่นให้สินค้า</h1>
        <RadioGroup value={productType} onChange={handleSelected2Change} >
          <FormControlLabel value="menu" control={<Radio />} label="เฉพาะรายการ" />
          <FormControlLabel value="category" control={<Radio />} label="หมวดหมู่" />
          <FormControlLabel value="amount" control={<Radio />} label="คำสั่งซื้อ" />
        </RadioGroup>
      </div>
    );
}


function Step2({ type,productType,selectedDays,setSelectedDays,data,setData,start_date,setStart_Date,finish_date,setFinish_Date,start_time,setStart_Time,finish_time,setFinish_Time
                ,selectedMenus,setSelectedMenus,selectedCategories,setSelectedCategories,amount,setAmount }) {
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const initial = useRef(false);
    const [prev,setPrev] = useState(selectedDays);


    const isDataValid = (data) => typeof data === 'number' && data > 0;
    const isStartDateValid = (start_date) => start_date == '';
    const isFinishDateValid = (finish_date) => finish_date == '';
    const isStartTimeValid = (start_time) => start_time == '';
    const isFinishTimeValid = (finish_time) => finish_time == '';
  
    useEffect(() => {
      async function fetchMenus() {
        try {
          const res = await fetch("http://localhost:5000/menus");
          const data = await res.json();
          setMenus(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching menus:", error);
        }
      }

      async function fetchCategories() {
        try {
          const res = await fetch("http://localhost:5000/category");
          const data = await res.json();
          setCategories(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching menus:", error);
        }
      }
  
      if (!initial.current) {
        initial.current = true;
        console.log(initial.current);
        fetchMenus();
        fetchCategories();
      }
    }, [selectedDays]);

    const handleDaySelect = (event, newSelectedDays) => {
      setSelectedDays(newSelectedDays);
    };

    const renderMenus = () => {
      return menus.map((menu) => (
        <FormGroup key={menu._id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedMenus.includes(menu._id)}
                onChange={() =>
                  setSelectedMenus((prev) =>
                    prev.includes(menu._id)
                      ? prev.filter((id) => id !== menu._id)
                      : [...prev, menu._id]
                  )
                }
              />
            }
            label={menu.name}
          />
        </FormGroup>
      ));
    };

    const renderCategories = () => {
      return categories.map((category) => (
        <FormGroup key={category._id}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedCategories.includes(category.name)}
                onChange={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(category.name)
                      ? prev.filter((id) => id !== category.name)
                      : [...prev, category.name]
                  )
                }
              />
            }
            label={category.name}
          />
        </FormGroup>
      ));
    };

    const formatDate = (dateString) => {
        return dateString.slice(0, 10);
    };
  
    const renderPromotionDetails = () => {

      const handleStartDateChange = (date) => {
        setStart_Date(date);
      
        if (finish_date && dayjs(date).isAfter(finish_date)) {
          Swal.fire('วันเริ่มต้นห้ามมากกว่าวันสิ้นสุด');
          setStart_Date(null);
        }
      };
      
      const handleFinishDateChange = (date) => {
        setFinish_Date(date);
      
        if (date && dayjs(date).isBefore(start_date)) {
          Swal.fire('วันเริ่มต้นห้ามมากกว่าวันสิ้นสุด');
          setFinish_Date(null);
        }
      };
      

      const handleStartTimeChange = (event) => {
        const newTime = event.target.value;
        setStart_Time(newTime);
      
        if (finish_time && dayjs(newTime, 'HH:mm').isAfter(dayjs(finish_time, 'HH:mm'))) {
          Swal.fire('เวลาเริ่มห้ามมากกว่าเวลาสิ้นสุด');
          setStart_Time('');
        }
      };
      
      const handleFinishTimeChange = (event) => {
        const newTime = event.target.value;
        setFinish_Time(newTime);
      
        if (newTime && dayjs(newTime, 'HH:mm').isBefore(dayjs(start_time, 'HH:mm'))) {
          Swal.fire('เวลาเริ่มห้ามมากกว่าเวลาสิ้นสุด');
          setFinish_Time('');
        }
      };

      return (
        <div>
          <h2>ระยะเวลาโปรโมชั่น</h2>
          <h4>วันเริ่มต้น</h4>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              renderInput={(props) => <TextField {...props} />}
              value={start_date}
              onChange={handleStartDateChange} 
            />
          </LocalizationProvider>

          <h4>วันสิ้นสุด</h4>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              renderInput={(props) => <TextField {...props} />}
              value={finish_date}
              onChange={handleFinishDateChange} 
            />
          </LocalizationProvider>

          <h4>วัน</h4>
          <div>
            {prev.map((day) => (
              <h1 key={day.day} value={day.day}>
                {day.day}
              </h1>
            ))}
          </div>
          <ToggleButtonGroup
            value={selectedDays}
            onChange={handleDaySelect}
            aria-label="Days of Week"
          >
            {daysOfWeek.map((day) => (
              <ToggleButton sx={{ "&.Mui-selected, &.Mui-selected:hover": {color: "green"}}} 
               key={day} value={day} >
                {day}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <h4>เวลาเริ่ม</h4>
          <TextField
            label="Alarm clock"
            type="time"
            value={start_time}
            onChange={handleStartTimeChange}
            error={isStartTimeValid(start_time)}
            helperText='กรุณาใส่เวลาเริ่ม'
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, 
            }}
          />
          <h4>เวลาสิ้นสุด</h4>
          <TextField
            label="Alarm clock"
            type="time"
            value={finish_time}
            onChange={handleFinishTimeChange}
            error={isFinishTimeValid(finish_time)}
            helperText='กรุณาใส่เวลาสิ้นสุด'
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300,
            }}
          />
        </div>
      );
    };
  
    return (
      <div style={{ display: 'flex' }}>
        <Box style={{ flex: 1 }}>
        <div>
        {type === "percent" ? (
          <div>
            <h2>เปอร์เซ็นต์</h2>
            <TextField
                label="percent"
                value={data}
                color="secondary"
                error={data<=0 && typeof data !== 'number'}
                helperText={"กรุณาใส่มูลค่าส่วนลด (เปอร์เซ็น)"}
                focused
                onChange={(e) => setData(e.target.value)}
              />
            {renderPromotionDetails()}
          </div>
        ) : type === "specific" ? (
          <div>
            <h2>เจาะจง</h2>
            <TextField
                label="specific"
                value={data}
                color="secondary"
                error={data<=0 && typeof data !== 'number'}
                helperText="กรุณาใส่มูลค่าส่วนลด (ราคา)"
                focused
                onChange={(e) => setData(e.target.value)}
              />
            {renderPromotionDetails()}
          </div>
        ) : type === "free" ? (
          <div>
            <h2>ฟรี</h2>
            <TextField
                label="free"
                value={data}
                color="secondary"
                error={data<=0 && typeof data !== 'number'}
                helperText="ขั้นต่ำคำสั่งซื้อ"
                focused
                onChange={(e) => setData(e.target.value)}
              />
            {renderPromotionDetails()}
          </div>
        ) : null}
        </div>
        </Box>

        <Box style={{ flex: 1 }}>
        <div>
          {productType === 'menu' ? (
            <div>
              <h2>เลือกเมนู</h2>
              {renderMenus()}
            </div>
          ): productType === 'category' ? (
            <div>
              <h2>เลือกหมวดหมู่</h2>
              {renderCategories()}
            </div>
          ): productType === 'amount' ? (
            <div>
              <h2>คำสั่งซื้อ</h2>
              <TextField
                label="free"
                color="secondary"
                helperText="ขั้นต่ำคำสั่งซื้อ"
                error={amount<0 && typeof amount !== 'number'}
                value= {amount}
                onChange={(e) => setAmount(e.target.value)}
                focused
              />
            </div>
          ):null}
        </div>
        </Box>
      </div>
    );
}
  


function Step3({topic,setTopic,message,setMessage,image,setImage}) {

  const isTopicValid = (topic) => topic=='';
  const isMessageValid = (message) => message=='';

  function handleChangeFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
    };

    reader.readAsDataURL(file);
  }
  
  function handleReset(){
    /* setMessage('')
    setTopic('') */
    setImage(null)
  }

  return (
    <div>
      {/* Image */}
      กรุณาใส่รูปภาพ Banner
      <br/>
      <span style={{color:'red'}}>* รูปภาพจะแสดงในรูปแบบ 1200 x 250</span>
      <Box  sx={{ display: 'flex', justifyContent:'center'}}>
      <Box >
        <input id="file-input" type="file" onChange={handleChangeFile} accept="image/*" />
        <br/>
        <br/>
        {image && <img src={image} style={{ width: '1200px', height: '250px' }} alt="Preview" />}
      </Box>

      {/* Topic and Message */}
      <Box sx={{  m: 1, width: "25ch",}}>
        <Box sx={{ mb: 2 }}>
        <TextField
            focused
            label="หัวข้อ"
            name="topic"
            value={topic}
            color="secondary"
            error={isTopicValid(topic)}
            onChange={(e) => setTopic(e.target.value)}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
        <TextField
            focused
            label="ข้อความ"
            name="message"
            value={message}
            color="secondary"
            error={isMessageValid(message)}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

      {/* <Button onClick={handleReset}>
        <h1>Reset</h1>
      </Button> */}
      </Box>
      </Box>
    </div>
  );
}

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [type, setType] = useState('');
  const [productType, setProductType] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [data, setData] = useState(0);
  const [start_date, setStart_Date] = useState(null);
  const [finish_date, setFinish_Date] = useState(null);
  const [start_time, setStart_Time] = useState('12:00');
  const [finish_time, setFinish_Time] = useState('12:00');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [promotion,setPromotion] = useState([]);
  const initial = useRef(false);
  const router = useRouter();
  const { id } = router.query;
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedCategories, setSelectedCategories]  = useState([]);
  const [amount, setAmount] = useState(0);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  useEffect(() => {
    async function fetchPromotion() {
      try {
        const res = await fetch(`http://localhost:5000/promotions/${id}`);
        const data = await res.json();
        setPromotion(data);
        setSelectedDays(data.days);
        setType(data.type);
        setProductType(data.productType);
        setData(data.data);
        setStart_Date(data.start_date);
        setFinish_Date(data.finish_date);
        setStart_Time(data.start_time);
        setFinish_Time(data.finish_time);
        setTopic(data.topic);
        setMessage(data.message);
        setImage(data.image);
        setSelectedMenus(data.menuId);
        setSelectedCategories(data.category);
      } catch (error) {
        console.error("Error fetching promotion:", error);
      }
    }

    console.log(selectedDays);

    if (!initial.current) {
        initial.current = true;
        fetchPromotion();
    }
  }, [id,selectedDays]);

  const handleNext = () => {
    let newSkipped = skipped;
    if(!type && !productType){
      Swal.fire("Error",'คุณยังไม่ได้เลือกรูปแบบโปรโมชั่น','error');
      return;
    }
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 setType={setType} type={type} setProductType={setProductType} productType={productType} />;
      case 1:
        return  <Step2
            type={type}
            productType={productType}
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
            data={data}
            setData={setData}
            start_date={start_date}
            setStart_Date={setStart_Date}
            finish_date={finish_date}
            setFinish_Date={setFinish_Date}
            start_time={start_time}
            setStart_Time={setStart_Time}
            finish_time={finish_time}
            setFinish_Time={setFinish_Time}
            selectedMenus={selectedMenus}
            setSelectedMenus={setSelectedMenus}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            amount={amount}
            setAmount={setAmount}
          />
      case 2:
        return <Step3 topic={topic} setTopic={setTopic} message={message} setMessage={setMessage} image={image} setImage={setImage}/>;
      default:
        return null;
    }
  };

  async function handleDeletePromotion(e) {
    e.preventDefault();
    Swal.fire({
      title: "ต้องการลบ Promotion นี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`ลบ Promotion นี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/promotions/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete this menu");
          }
          setImage(null);
          setType("");
          setProductType("");
          setSelectedDays([]);
          setData("");
          setStart_Date("");
          setFinish_Date("");
          setStart_Time("");
          setFinish_Time("");
          setTopic("");
          setMessage("");
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
    })
  }

  async function handleSubmit(e){
    e.preventDefault();
    console.log(type);
    console.log(selectedDays);
    if (!image || !type || !productType || !data || !start_date || !finish_date || !start_time || !finish_time || !topic || !message || !selectedDays) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
      return;
    }
    Swal.fire({
      title: "ต้องการแก้ไข Promotion นี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true,
      denyButtonText: "ยกเลิก", 
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/promotions/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            type: type,
            productType: productType,
            data: data,
            days: selectedDays,
            start_date: start_date,
            finish_date: finish_date,
            start_time: start_time,
            finish_time: finish_time,
            image: image,
            topic: topic,
            message: message,
            menuId: selectedMenus,
            category: selectedCategories,
            amount: amount,
            updated_at: new Date().toISOString(),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          Swal.fire(`แก้ไข Promotion ไม่สำเร็จ`, "", "error");
          throw new Error("Failed to add new promotion");
        }
        Swal.fire(`แก้ไข Promotion นี้แล้ว`, "", "success");
        setActiveStep(0);
        setSkipped(new Set());
        const resJson = await response.json();
        console.log(resJson);
    }catch(error){
      console.log("Error:", error.message);
    }
  }})
  }

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%', padding: '25px' }}>
      <Button style={{ background: 'red' }} variant="contained" onClick={handleDeletePromotion}>ลบ Promotion</Button>
        <Stepper activeStep={activeStep} sx={{ mt: '20px',padding: '10px' }}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {renderStepContent(activeStep)}
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {/* {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )} */}

              <Button onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </DashboardLayout>
  );
}