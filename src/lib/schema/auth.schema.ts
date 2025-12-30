import z from "zod";

const emailMessage = "올바른 이메일 형식을 입력해주세요.";
const passwordMessage = "비밀번호는 최소 6자 이상 입력해주세요.";

// 로그인 스키마
const loginSchema = z.object({
  email: z.string().email(emailMessage),
  password: z.string().min(6, passwordMessage),
});

// 회원가입 스키마
const signupSchema = z
  .object({
    email: z.string().email(emailMessage),
    password: z.string().min(6, passwordMessage),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .trim()
      .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
      .max(20, "닉네임은 20자 이내로 입력해주세요."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema };
export type { LoginFormValues, SignupFormValues };
