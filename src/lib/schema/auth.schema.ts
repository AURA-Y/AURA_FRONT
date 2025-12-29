import z from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "아이디는 3자 이상 입력해주세요.")
  .max(20, "아이디는 20자 이하로 입력해주세요.")
  .regex(/^[a-zA-Z0-9._-]+$/, "영문, 숫자, ., _, - 만 사용할 수 있습니다.");

const nameSchema = z
  .string()
  .trim()
  .min(2, "이름은 2자 이상 입력해주세요.")
  .max(30, "이름은 30자 이하로 입력해주세요.");

const passwordSchema = z.string().min(6, "비밀번호는 6자 이상 입력해주세요.");

// 로그인
const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

// 회원가입
const signupSchema = z
  .object({
    username: usernameSchema,
    name: nameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema };
export type { LoginFormValues, SignupFormValues };
