import { useCallback, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useEffect, useRef } from "react";
import { AuthProvider } from "src/contexts/auth-context";

const Page = () => {
  const [userProp, setUserProp] = useState([]);
  const [store, setStore] = useState([]);
  const router = useRouter();
  const auth = useAuth();
  const initial = useRef(false);
  const [method, setMethod] = useState("email");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const user = store.find(
          (storedUser) =>
            storedUser.email === values.email && storedUser.password === values.password
        );

        if (user) {
          setUserProp(user);
          console.log("Login successful");
          auth.signIn(user);
          router.push("/");
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Please check your email and password !!" });
          helpers.setSubmitting(false);
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  const handleSkip = useCallback(() => {
    auth.skip();
    router.push("/");
  }, [auth, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/shops");
        const data = await response.json();
        setStore(data); // Update the state with fetched data
        console.log(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
      fetchUser();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>เข้าสู่ระแบบ</title>
      </Head>

      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
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
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="h4">เข้าสู่ระแบบ</Typography>
              <Typography color="text.secondary" variant="h6">
                ยังไม่มีร้านค้าใช่หรือไม่ &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="h6"
                >
                  ไปที่หน้าลงทะเบียนร้านค้า
                </Link>
              </Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab sx={{fontSize:'25px'}} label="Email" value="email" />
            </Tabs>
            {method === "email" && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    inputProps={{style: {fontSize: 23}}}
                    InputLabelProps={{style: {fontSize: 20}}}
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
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
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>

                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button fullWidth size="large" sx={{ mt: 3,fontSize:23 }} type="submit" variant="contained">
                  Continue
                </Button>
                <Button  fullWidth size="large" sx={{ mt: 3,fontSize:23 }} onClick={handleSkip}>
                  Skip authentication
                </Button>

                {/*
                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                   <div>
                    You can use <b>demo@devias.io</b> and password <b>Password123!</b>
                  </div>
                </Alert>*/}
              </form>
            )}
          </div>
        </Box>
      </Box>
      {/* </AuthProvider> */}
    </div>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
