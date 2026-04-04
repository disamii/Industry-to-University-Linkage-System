import Logo from "@/components/logo";

const SigninHeader = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <Logo hasLabel={true} />
      <h1 className="font-bold text-3xl md:text-4xl tracking-tighter">
        Welcome back
      </h1>
      <p className="mt-3 text-muted-foreground text-sm">
        Please enter your professional credentials
      </p>
    </div>
  );
};

export default SigninHeader;
