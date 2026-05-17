import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Book,
  Lightbulb,
  MessageCircle,
} from 'lucide-react';

import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
} from 'react-icons/fa';

const IgniteProgramPage = () => {
  return (
    <>
      <Helmet>
        <title>Ignite Program | iLearn IAS Academy</title>
        <meta
          name="description"
          content="Join our comprehensive Ignite program covering both preliminary and main examinations with Kerala's highest success rate."
        />
        <meta
          name="keywords"
          content="UPSC, Civil Services, College Students, iLearn IAS, Foundation Course, Kerala UPSC Coaching"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-blue to-primary-blue-dark text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                iLearn IAS Ignite
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                An Exclusive UPSC Foundation Program for College Students
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                

                <Link to="/contact">
                  <Button size="lg" className="bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Program Overview */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  About the Program
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                iLearn IAS Ignite is a dynamic, UPSC-aligned foundation program specially designed for college students. It provides structured guidance, expert mentorship, and leadership-focused engagement - helping you take your first serious step toward becoming a civil servant. Whether you’re just entering college or already in your final year, Ignite ensures that your UPSC journey begins with clarity, confidence, and a community that supports your growth.                </p>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-10">
                  Why Join iLearn IAS Ignite?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  'Learn directly from experienced iLearn IAS faculty',
                  'Build strong UPSC fundamentals during college with periodic assessment',
                  'Receive structured weekly guidance to stay on track with personalised mentorship',
                  'Develop critical thinking and problem-solving skills from serving IAS/IPS officers',
                  'Be part of Kerala’s most vibrant UPSC student network'
                ].map((text, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {text}
                    </h3>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Program Structure
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                  {
                    icon: Clock,
                    title: 'Duration',
                    desc: '10 months (Aug 15, 2025 - June 20, 2026)',
                  },
                  {
                    icon: Book,
                    title: 'Delivery Mode',
                    desc: 'Online (REC + LIVE)',
                  },
                  {
                    icon: Trophy,
                    title: 'Total Hours',
                    desc: '300+ hrs of structured content',
                  },
                  {
                    icon: BookOpen,
                    title: 'Saturday',
                    desc: '3-hour LIVE GS Session led by iLearn IAS Faculty Team',
                  },
                  {
                    icon: Lightbulb,
                    title: 'Sunday',
                    desc: (
                      <div className="text-gray-600 text-sm">
                        <p>LIVE STRATEGY Session on:</p>
                        <ul className="list-disc list-inside mt-2 text-left" style={{ textAlign: 'center' }}>
                          <li>Solving Prelims MCQs</li>
                          <li>Mains Answer Writing</li>
                          <li>Note Making</li>
                          <li>Essay writing</li>
                          <li>Doubt Clearance</li>
                        </ul>
                      </div>
                    ),
                  },
                  {
                    icon: Star,
                    title: 'Weekly Prelims Practice Tests',
                    desc: '25 Q on portal; Open from Saturday 5 PM till end of next day',
                  },
                  {
                    icon: CheckCircle,
                    title: 'Monthly Mains Answer Writing Test',
                    desc: (
                      <>
                        <p>On a Sunday, followed by a brief discussion</p>
                        <p>5 Q per test; Evaluation & feedback by mentor</p>
                      </>
                    ),
                  },
                  {
                    icon: Users,
                    title: 'Mentorship & Feedback',
                    desc: (
                      <>
                        <p>1-on-1 Mentorship (twice a month)</p>
                        <p>Group Mentorship once a month</p>
                      </>
                    ),
                  },
                  {
                    icon: BookOpen,
                    title: 'Subject-wise UPSC PYQ Compilation',
                    desc: '(2013–2025)',
                  },
                  {
                    icon: MessageCircle,
                    title: 'Daily Newspaper Analysis',
                    desc: 'Daily 30 Min REC sessions + curated notes',
                  },
                  {
                    icon: Lightbulb,
                    title: 'Current Affairs Support',
                    desc: (
                      <>
                        <p>Daily News: iLearn BEACON</p>
                        <p>Prelims: Chai Pe Quest</p>
                        <p>Mains: iMPACT</p>
                      </>
                    ),
                  },
                  {
                    icon: Trophy,
                    title: 'Officer On Duty',
                    desc: 'Monthly LIVE sessions guided by IAS/IPS officers to build leadership and decision-making',
                  }
                ].map(({ icon: Icon, title, desc }, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-blue" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                    <div className="text-gray-600">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Learning Outcomes */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Learning Outcomes
              </h2>
              <p className="text-xl text-gray-600">
                Our program is designed to shape young minds into future leaders...
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                'Master UPSC GS Basics with a structured approach through LIVE & REC sessions',
                'Familiarize with UPSC PYQs to understand exam trends and focus areas',
                'Learn leadership from civil servants via “Officer on Duty” monthly sessions',
                'Stay focused through 1-on-1 mentorship, group sessions, and evaluated tests',
                'Strengthen current affairs with daily news analysis and integrated UPSC tools',
                'Develop Prelims + Mains skills through live sessions, practice & feedback'
              ].map((text, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enrollment & Contact */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-red mb-4">
                Enrollment & Contact
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-6">
                <div className="flex items-center justify-center gap-2 text-primary-blue font-semibold mb-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    New batches starting on <strong>August 9, 2025</strong> — early registration encouraged!
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
                  <div className="text-gray-700">📞 Call: 75 111 00 567</div>
                  <div className="text-gray-700">✉ learniasignite@gmail.com</div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/contact">
                    <Button size="lg" className="bg-primary-red hover:bg-red-600 text-white px-8 py-4 h-auto">
                      Apply Now
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white px-8 py-4 h-auto">
                      Speak with our Team
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Social */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-red mb-4">
                Community & Social
              </h2>

              <div className="bg-white rounded-lg p-8 shadow-sm flex flex-col items-center gap-4 mb-8 border border-blue-100">
                <div className="flex items-center gap-2 text-primary-blue font-semibold text-lg mb-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>Join Our Telegram Community</span>
                </div>
                <div className="text-gray-700 mb-2">
                  iLearn IAS Junior Squad - A fun and focused UPSC learning club for school students
                </div>
                <a href="https://t.me/ilearniasjunior" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2 h-auto">
                    Join Telegram Group
                  </Button>
                </a>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                Engage with us on Social Media
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
                <a href="https://instagram.com/ilearniasjunior" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block">
                  <FaInstagram className="mx-auto mb-2 text-pink-500" />
                  <div className="font-semibold mb-1">Instagram</div>
                  <div className="text-gray-600 text-sm">@ilearniasjunior</div>
                </a>

                <a href="https://facebook.com/ilearniasjunior" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block">
                  <FaFacebook className="mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold mb-1">Facebook</div>
                  <div className="text-gray-600 text-sm">/ilearniasjunior</div>
                </a>

                <a href="https://youtube.com/ilearniasjunior" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block">
                  <FaYoutube className="mx-auto mb-2 text-red-500" />
                  <div className="font-semibold mb-1">YouTube</div>
                  <div className="text-gray-600 text-sm">/ilearniasjunior</div>
                </a>

                <a href="https://linkedin.com/company/ilearniasjunior" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-4 shadow-sm text-center border border-blue-100 transition hover:shadow-lg hover:border-primary-blue cursor-pointer block">
                  <FaLinkedin className="mx-auto mb-2 text-blue-700" />
                  <div className="font-semibold mb-1">LinkedIn</div>
                  <div className="text-gray-600 text-sm">/ilearniasjunior</div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Hub */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-red mb-4">
                Knowledge Hub
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {['Reel 1', 'Reel 2', 'Reel 3'].map((text, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-16 shadow border border-blue-100 flex items-center justify-center min-h-[220px] text-lg font-medium text-gray-400">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </PageTransition>
    </>
  );
};

export default IgniteProgramPage;
