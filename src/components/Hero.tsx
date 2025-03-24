import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';



const Hero = () => {
  return (
    <div className="relative overflow-hidden hero-gradient py-8 md:py-12 ">
      <div className="max-w-7xl mx-auto ">
        <div className="relative z-10 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row items-center">
              <div className="sm:text-center lg:text-left lg:w-3/5">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900  sm:text-5xl md:text-6xl">
                  <span className="block text-gray-700 xl:inline">
                    Your Personal,
                    <div className="relative inline-block">
                      <span className="bg-gradient-to-r from-green-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient  font-extrabold">
                        AI-Powered Fitness Coach
                      </span>
                      <svg
                        className="absolute -bottom-4 md:-bottom-8 left-[-25px]"
                        viewBox="0 0 200 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0,5 Q50,2 100,5 T200,5"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className="animate-draw"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0369a1" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  FitCraft uses AI to create personalized workout and nutrition plans tailored to
                  your unique goals, preferences, and lifestyle.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/signup">
                      <Button className="w-full bg-fitcraft-primary hover:bg-fitcraft-secondary">
                        Get started
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/onboarding">
                      <Button variant="outline" className="w-full">
                        Create workout plan
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="lg:w-2/5 flex justify-center mb-6 lg:mb-0">
                <div className="w-3/4 max-w-xs md:max-w-sm">
                  <svg
                    className="w-full h-auto animate-float"
                    viewBox="0 0 500 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Hand-drawn style fitness illustration */}
                    <path
                      d="M200,150 Q230,120 260,150 T320,150"
                      stroke="#0a435b"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M120,200 C140,180 160,180 180,200 S220,220 240,200"
                      stroke="#0369a1"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="350"
                      cy="180"
                      r="40"
                      stroke="#84cc16"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M180,250 C200,230 230,230 250,250 S280,270 300,250"
                      stroke="#38bdf8"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Dumbbell */}
                    <circle cx="150" cy="300" r="15" fill="#0369a1" />
                    <rect x="165" y="295" width="70" height="10" fill="#38bdf8" />
                    <circle cx="250" cy="300" r="15" fill="#0369a1" />
                    {/* Person figure */}
                    <circle cx="300" cy="100" r="20" stroke="#0369a1" strokeWidth="3" fill="none" />
                    <line
                      x1="300"
                      y1="120"
                      x2="300"
                      y2="180"
                      stroke="#0369a1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="300"
                      y1="140"
                      x2="270"
                      y2="160"
                      stroke="#0369a1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="300"
                      y1="140"
                      x2="330"
                      y2="160"
                      stroke="#0369a1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="300"
                      y1="180"
                      x2="280"
                      y2="230"
                      stroke="#0369a1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="300"
                      y1="180"
                      x2="320"
                      y2="230"
                      stroke="#0369a1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Hero;
