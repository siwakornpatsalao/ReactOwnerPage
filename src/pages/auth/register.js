import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import Swal from "sweetalert2";

const Page = () => {
  const [store, setStore] = useState([]);
  const [emailExists, setEmailExists] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      number: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .max(255)
        .required("กรุณากรอก Email")
        .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "กรุณากรอก Email ให้ถูกต้อง"),
      name: Yup.string().max(255).required("กรุณากรอกชื่อร้านค้า"),
      password: Yup.string().min(8, "กรุณากรอกรหัสผ่านอย่างน้อย8ตัว").required("กรุณากรอกรหัสผ่าน"),
      passwordConfirm: Yup.string()
        .min(8, "กรุณากรอกรหัสผ่านอย่างน้อย8ตัว")
        .required("กรุณากรอกยืนยันรหัสผ่าน"),
      number: Yup.string()
        .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทร 10 หลัก")
        .required("กรุณากรอกเบอร์โทร"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const storedValues = {
          email: values.email,
          name: values.name,
          number: values.number,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
        };
        setStore([...store, storedValues]);

        if (values.password !== values.passwordConfirm) {
          throw new Error("รหัสผ่านไม่ตรงกัน");
        }

        // Check if the email exists
        const emailAlreadyExists = store.some((user) => user.email === storedValues.email);
        if (emailAlreadyExists) {
          setEmailExists(true);
          return;
        }

        Swal.fire({
          title: "ต้องการเพิ่มร้านค้านี้หรือไม่",
          confirmButtonText: "ยืนยัน",
          showDenyButton: true,
          denyButtonText: "ยกเลิก",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await fetch("http://localhost:5000/shops", {
                method: "POST",
                body: JSON.stringify({
                  name: storedValues.name,
                  phone: storedValues.number,
                  email: storedValues.email,
                  password: storedValues.password,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!response.ok) {
                throw new Error("Failed to add new User");
              }
              Swal.fire({
                text: `เพิ่มผู้ใช้แล้ว`,
                icon: "success",
                confirmButtonText: "ไปที่หน้า Login",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  handleGoLogin();
                }
              });

              const resJson = await response.json();
              console.log(resJson);
              setEmailExists(false);
              formik.resetForm();
            } catch (error) {
              console.log("Error:", error.message);
            }
          }
        });

        await auth.signUp(
          values.email,
          values.name,
          values.password,
          values.passwordConfirm,
          values.number
        );
        router.push("/");
      } catch (err) {}
    },
  });

  const handleGoLogin = useCallback(() => {
    auth.skip();
    router.push("/auth/login");
  }, [auth, router]);

  useEffect(() => {
    const storedValuesString = localStorage.getItem("registrationValues");
    let storedValues = [];

    if (storedValuesString) {
      storedValues = JSON.parse(storedValuesString);
    }

    setStore(storedValues);
    console.log(store);

    if (
      storedValues.email &&
      storedValues.name &&
      storedValues.number &&
      storedValues.password &&
      storedValues.passwordConfirm
    ) {
      formik.setValues({
        email: storedValues.email,
        name: storedValues.name,
        number: storedValues.number,
        password: storedValues.password,
        passwordConfirm: storedValues.passwordConfirm,
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Register | Devias Kit</title>
      </Head>
      <Box
        sx={{
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">ลงทะเบียนร้านค้า</Typography>
              <Typography color="text.secondary" variant="h6">
                คุณมีร้านค้าอยู่แล้วหรือไม่ &nbsp;
                <Link component={NextLink} href="/auth/login" underline="hover" variant="h6">
                  ไปที่ Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  inputProps={{style: {fontSize: 23}}}
                  InputLabelProps={{style: {fontSize: 20}}}
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="ชื่อร้านค้า"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  inputProps={{style: {fontSize: 23}}}
                  InputLabelProps={{style: {fontSize: 20}}}
                  error={!!(formik.touched.number && formik.errors.number)}
                  fullWidth
                  helperText={formik.touched.number && formik.errors.number}
                  label="เบอร์โทร"
                  name="number"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.number}
                />
                <TextField
                  inputProps={{style: {fontSize: 23}}}
                  InputLabelProps={{style: {fontSize: 20}}}
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  inputProps={{style: {fontSize: 23}}}
                  InputLabelProps={{style: {fontSize: 20}}}
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="รหัสผ่าน"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  inputProps={{style: {fontSize: 23}}}
                  InputLabelProps={{style: {fontSize: 20}}}
                  error={!!(formik.touched.passwordConfirm && formik.errors.passwordConfirm)}
                  fullWidth
                  helperText={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
                  label="ยืนยันรหัสผ่าน"
                  name="passwordConfirm"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.passwordConfirm}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              {emailExists && (
                <Typography color="error" sx={{ mt: 2,fontSize:23 }} variant="body2">
                  อีเมลนี้ถูกใช้งานแล้ว
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3,fontSize:23 }} type="submit" variant="contained">
                ยืนยัน
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
