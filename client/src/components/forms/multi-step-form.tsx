import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { COUNTRIES, SKILL_LEVELS, GAMES } from "@/lib/constants";

// Extend the insert schema with more validation and optional fields for the form
const formSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email format"),
  country: z.string().optional(),
  bio: z.string().optional(),
  skillLevel: z.string().optional(),
  discordUsername: z.string().optional(),
  selectedGames: z.array(z.number()).min(1, "Select at least one game"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  newsletter: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const { registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      country: "",
      bio: "",
      skillLevel: "",
      discordUsername: "",
      selectedGames: [],
      terms: false,
      newsletter: false,
    },
  });

  const nextStep = async () => {
    // Validate the current step fields before proceeding
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["username", "email", "password", "confirmPassword", "country"];
        break;
      case 2:
        fieldsToValidate = ["selectedGames", "skillLevel"];
        break;
      case 3:
        fieldsToValidate = [];
        break;
      case 4:
        fieldsToValidate = ["terms"];
        break;
    }
    
    const isStepValid = await form.trigger(fieldsToValidate);
    
    if (isStepValid) {
      if (step < 4) {
        setStep(step + 1);
        setProgress((step + 1) * 25);
      } else {
        // Final step, submit the form
        onSubmit(form.getValues());
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress((step - 1) * 25);
    }
  };

  const onSubmit = (data: FormValues) => {
    // Prepare data for API
    const userData = {
      username: data.username,
      password: data.password,
      email: data.email,
      country: data.country,
      bio: data.bio,
      skillLevel: data.skillLevel,
      discordUsername: data.discordUsername,
    };

    registerMutation.mutate(userData, {
      onSuccess: () => {
        setLocation("/dashboard");
      }
    });
  };

  const handleGameSelection = (gameId: number) => {
    const currentGames = form.getValues().selectedGames || [];
    const isSelected = currentGames.includes(gameId);
    
    let newSelectedGames;
    if (isSelected) {
      newSelectedGames = currentGames.filter(id => id !== gameId);
    } else {
      newSelectedGames = [...currentGames, gameId];
    }
    
    form.setValue("selectedGames", newSelectedGames, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <div className="mb-6">
        <div className="relative w-full h-4 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <div className={`text-center ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`h-8 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-700'} flex items-center justify-center mx-auto`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs mt-1">Profile</div>
          </div>
          <div className={`text-center ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`h-8 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-700'} flex items-center justify-center mx-auto`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="text-xs mt-1">Games</div>
          </div>
          <div className={`text-center ${step >= 3 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`h-8 w-8 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-700'} flex items-center justify-center mx-auto`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs mt-1">Media</div>
          </div>
          <div className={`text-center ${step >= 4 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`h-8 w-8 rounded-full ${step >= 4 ? 'bg-primary' : 'bg-gray-700'} flex items-center justify-center mx-auto`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-xs mt-1">Complete</div>
          </div>
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div>
          <h3 className="font-bold text-xl font-rajdhani text-white mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your gaming handle" 
                      {...field} 
                      className="bg-dark border-gray-700 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      {...field} 
                      className="bg-dark border-gray-700 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark border-gray-700 focus:border-primary">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-dark border-gray-700">
                      {COUNTRIES.map(country => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mb-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Create a secure password" 
                      {...field} 
                      className="bg-dark border-gray-700 focus:border-primary"
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with a mix of letters, numbers, and symbols
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mb-6">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Confirm your password" 
                      {...field} 
                      className="bg-dark border-gray-700 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Step 2: Game Preferences */}
      {step === 2 && (
        <div>
          <h3 className="font-bold text-xl font-rajdhani text-white mb-4">Game Preferences</h3>
          <div className="mb-6">
            <FormLabel className="block text-sm font-medium text-gray-400 mb-2">Select Your Games *</FormLabel>
            <p className="text-xs text-gray-500 mb-3">Choose the games you want to compete in</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GAMES.map(game => {
                const isSelected = form.getValues().selectedGames?.includes(game.id);
                return (
                  <div key={game.id} className="relative">
                    <div 
                      className={`flex flex-col items-center p-3 border ${isSelected ? 'border-primary' : 'border-gray-700'} rounded-lg bg-dark cursor-pointer hover:border-primary transition-colors`}
                      onClick={() => handleGameSelection(game.id)}
                    >
                      <img 
                        src={`${game.image}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50&q=80`} 
                        alt={game.name} 
                        className="h-10 w-10 rounded object-cover mb-2" 
                      />
                      <span className="text-white text-sm">{game.name}</span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {form.formState.errors.selectedGames && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.selectedGames.message}
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <FormField
              control={form.control}
              name="skillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Skill Level *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      {SKILL_LEVELS.map(level => (
                        <div key={level.id} className="flex items-center">
                          <RadioGroupItem value={level.id} id={level.id} className="text-primary" />
                          <FormLabel htmlFor={level.id} className="ml-2 text-white font-normal">
                            {level.label}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Step 3: Profile Media */}
      {step === 3 && (
        <div>
          <h3 className="font-bold text-xl font-rajdhani text-white mb-4">Profile Media</h3>
          
          <div className="mb-6">
            <FormLabel className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</FormLabel>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-700 rounded-md hover:border-primary transition-colors">
              <div className="space-y-1 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-dark rounded-md font-medium text-primary hover:text-secondary">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 2MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself as a gamer..." 
                      className="resize-none bg-dark border-gray-700 focus:border-primary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mb-6">
            <FormField
              control={form.control}
              name="discordUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="username#0000" 
                      {...field} 
                      className="bg-dark border-gray-700 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* Step 4: Complete Registration */}
      {step === 4 && (
        <div>
          <h3 className="font-bold text-xl font-rajdhani text-white mb-4">Complete Registration</h3>
          
          <div className="mb-6">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the <a href="#" className="text-primary hover:text-secondary">Terms and Conditions</a> and <a href="#" className="text-primary hover:text-secondary">Privacy Policy</a>.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <div className="mb-6">
            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Subscribe to our newsletter for tournament updates and gaming news.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <div className="mb-6">
            <div className="p-4 rounded-lg bg-dark">
              <h4 className="font-medium text-white mb-2">Connect with Social Accounts (Optional)</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2 bg-[#4285F4]/10 border-[#4285F4]/50 hover:bg-[#4285F4]/20 hover:border-[#4285F4]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2 bg-[#7289DA]/10 border-[#7289DA]/50 hover:bg-[#7289DA]/20 hover:border-[#7289DA]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#7289DA]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  Discord
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2 bg-[#171a21]/10 border-[#171a21]/50 hover:bg-[#171a21]/20 hover:border-[#171a21]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.006.105.006.158 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
                  </svg>
                  Steam
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            className="border-gray-700 hover:border-primary text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Previous
          </Button>
        )}
        {step < 4 ? (
          <Button 
            type="button" 
            onClick={nextStep}
            className="ml-auto bg-primary hover:bg-primary/80"
          >
            Next Step
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        ) : (
          <Button 
            type="button"
            onClick={nextStep}
            className="ml-auto bg-primary hover:bg-primary/80"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Complete Registration
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </Button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <p className="text-center text-gray-500 text-sm">
          Already have an account? <a href="/auth" className="text-primary hover:text-secondary">Login here</a>
        </p>
      </div>
    </Form>
  );
};

export default MultiStepForm;
