import { Helmet } from "react-helmet";
import { Link } from "wouter";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  MessageCircle,
  Lightbulb,
  Globe,
  UserCheck,
  Group,
  GraduationCap,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from "lucide-react";

const ilearnIASJuniorPage = () => {
  return (
    <>
      <Helmet>
        <title>iLearn IAS Junior | iLearn IAS Academy</title>
        <meta
          name="description"
          content="A flagship IAS skill development program for school students in classes 8, 9 & 10. Build confidence, curiosity, and character with iLearn IAS Junior."
        />
      </Helmet>
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
                iLearn IAS Junior
              </h1>
              <p className="text-sm sm:text-md md:text-lg text-blue-100 mb-2 sm:mb-4 max-w-2xl mx-auto">
                A Flagship IAS Skill Development Program for School Students
              </p>
              <div className="text-blue-100 mb-4 sm:mb-8 text-sm sm:text-base">
                OPEN FOR STUDENTS IN CLASSES
                <br />
                8, 9 & 10
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                {/* <div className="text-blue-100 font-semibold flex items-center justify-center">
                  📞 Connect with us: 75 111 00 567
                </div> */}
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto"
                  >
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About the Program */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                About the Program
              </h2>
              <p className="text-base sm:text-lg text-gray-700 bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                iLearn IAS Junior is a foundation-building program crafted for
                school students in classes 8, 9 and 10. It introduces children
                to the values, concepts, and skills needed for a future in
                public service — through engaging classes, simplified UPSC
                concepts, and skill oriented activities. It’s more than a class
                — it’s a space where children grow in confidence, curiosity, and
                character.
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                Why Join iLearn IAS Junior?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm flex items-start gap-3 sm:gap-4">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Learn age-appropriate concepts from History, Polity,
                    Geography, Economics etc
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm flex items-start gap-3 sm:gap-4">
                <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Build general awareness and critical thinking from a young
                    age
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm flex items-start gap-3 sm:gap-4">
                <UserCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Get guided by serving IAS/IPS officers, trained iLearn IAS
                    mentors, expert teachers
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm flex items-start gap-3 sm:gap-4">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Get guided by serving IAS/IPS officers, trained iLearn IAS
                    mentors, expert teachers
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm flex items-start gap-3 sm:gap-4">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-primary-blue mt-1" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    Build early clarity about the Civil Services journey
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Structure */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                Program Structure
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  Duration
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  10 months till June 2026
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  Delivery Mode
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Online (LIVE + REC)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                  Daily Analysis
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Daily 15-minute Newspaper Analysis [REC]
                </p>
              </div>
            </div>
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  Weekly Schedule
                </h3>
                <ul className="text-gray-700 list-disc list-inside text-left text-sm sm:text-base">
                  <li>
                    Saturday: 2-hour General Studies [GS] Session - Content
                    aligned with UPSC foundation themes [LIVE + REC]
                  </li>
                  <li>
                    Sunday: 2 Things like a Civil Servant - 2 hour LIVE case
                    studies/skills sessions delivered by serving IAS/IPS
                    officers
                  </li>
                  <li>
                    "QUIZZYBEE" - weekly mixed-format tests (MCQ + descriptive)
                  </li>
                  <li>
                    Skill Development Sessions on Debate/Public Speaking,
                    Communicative English etc
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  Personalized Mentorship
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  1-on-1 Personalized Mentorship sessions for students along
                  with parents’ participation and regular progress tracking
                  (thrice a month)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Outcomes */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                Learning Outcomes
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                Our program is designed to shape young minds into future leaders
                through comprehensive learning and skill development
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <ul className="space-y-4 sm:space-y-6">
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 mt-1" />
                  <span className="text-gray-800 text-sm sm:text-base">
                    Nurturing little minds in creative problem solving &
                    real-life decision making, learning from top IAS/IPS
                    officers of the nation
                  </span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 mt-1" />
                  <span className="text-gray-800 text-sm sm:text-base">
                    Gain general understanding in core subjects like Polity,
                    History, Geography, Economy, etc. through structured
                    learning sessions.
                  </span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 mt-1" />
                  <span className="text-gray-800 text-sm sm:text-base">
                    Receive personalized mentorship with regular 1-on-1 sessions
                    and parent involvement to guide academic and mindset growth.
                  </span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 mt-1" />
                  <span className="text-gray-800 text-sm sm:text-base">
                    Develop a daily newspaper reading routine through 15-minute
                    news analysis, helping the child to be an active learner.
                  </span>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 mt-1" />
                  <span className="text-gray-800 text-sm sm:text-base">
                    Enhance retention and engagement through weekly ‘QuizzyBee’
                    mixed-format tests with MCQs and descriptive questions.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Enrollment & Contact */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                Enrollment & Contact
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-primary-blue font-semibold mb-2 text-sm sm:text-base">
                  <Clock className="w-5 h-5" />
                  <span>
                    New batches starting on{" "}
                    <span className="font-bold">July 26, 2025</span> — early
                    registration encouraged!
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="text-gray-700 text-sm sm:text-base">
                    📞 Call: 75 111 00 567
                  </div>
                  <div className="text-gray-700 text-sm sm:text-base">
                    ✉️ ilearniasjunior@gmail.com
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto"
                    >
                      Apply Now
                    </Button>
                  </Link>
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white px-8 py-4 h-auto"
                    >
                      Speak with our Team
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Social */}
        <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                Community & Social
              </h2>
              {/* Telegram Card */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8 border border-blue-100">
                <div className="flex items-center gap-2 text-primary-blue font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>Join Our Telegram Community</span>
                </div>
                <div className="text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
                  iLearn IAS Junior Squad - A fun and focused UPSC learning club
                  for school students
                </div>
                <a
                  href="https://t.me/ilearniasjunior"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2 h-auto"
                  >
                    Join Telegram Group
                  </Button>
                </a>
              </div>
              {/* Social Media Heading */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold  border-blue-100 mb-4 sm:mb-6">
                Engage with us on Social Media
              </h3>
              {/* Social Media Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 justify-center">
                <a
                  href="https://instagram.com/ilearniasjunior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block"
                >
                  <Instagram className="w-7 h-7 mx-auto mb-1 sm:mb-2 text-pink-500" />
                  <div className="font-semibold mb-1 text-sm sm:text-base">
                    Instagram
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm">
                    @ilearniasjunior
                  </div>
                </a>
                <a
                  href="https://facebook.com/ilearniasjunior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block"
                >
                  <Facebook className="w-7 h-7 mx-auto mb-1 sm:mb-2 text-blue-600" />
                  <div className="font-semibold mb-1 text-sm sm:text-base">
                    Facebook
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm"></div>
                </a>
                <a
                  href="https://youtube.com/ilearniasjunior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block"
                >
                  <Youtube className="w-7 h-7 mx-auto mb-1 sm:mb-2 text-red-600" />
                  <div className="font-semibold mb-1 text-sm sm:text-base">
                    YouTube
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm"></div>
                </a>
                <a
                  href="https://linkedin.com/company/ilearniasjunior"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block"
                >
                  <Linkedin className="w-7 h-7 mx-auto mb-1 sm:mb-2 text-blue-700" />
                  <div className="font-semibold mb-1 text-sm sm:text-base">
                    LinkedIn
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm"></div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Hub */}
        <section className="py-10 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-red mb-3 sm:mb-4">
                Knowledge Hub
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mt-6 sm:mt-8">
                <div className="bg-gray-50 rounded-2xl p-8 sm:p-16 shadow border border-blue-100 flex items-center justify-center min-h-[120px] sm:min-h-[220px] text-base sm:text-lg font-medium text-gray-400">
                  Reel 1
                </div>
                <div className="bg-gray-50 rounded-2xl p-8 sm:p-16 shadow border border-blue-100 flex items-center justify-center min-h-[120px] sm:min-h-[220px] text-base sm:text-lg font-medium text-gray-400">
                  Reel 2
                </div>
                <div className="bg-gray-50 rounded-2xl p-8 sm:p-16 shadow border border-blue-100 flex items-center justify-center min-h-[120px] sm:min-h-[220px] text-base sm:text-lg font-medium text-gray-400">
                  Reel 3
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action (like PCM page) */}
        <section className="py-10 sm:py-16 md:py-20 bg-primary-blue text-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join our Junior program and be part of Kerala's most successful
                civil service coaching institute
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto"
                  >
                    Enroll Today
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-blue px-8 py-4 h-auto"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </>
  );
};

export default ilearnIASJuniorPage;
