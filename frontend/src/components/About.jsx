/**
 * About page component
 */
import React from 'react';
import Navbar from './shared/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-accent-green/20 border border-accent-green/30 rounded-none mb-6">
              <span className="text-accent-green text-sm font-semibold uppercase tracking-wider">
                About AI Interview Bot
              </span>
            </div>
            <h1 className="text-white mb-4">
              Revolutionizing Interview <span className="text-accent-green">Experiences</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              AI Interview Bot is a cutting-edge platform that transforms the traditional interview process 
              through intelligent automation, real-time transcription, and AI-powered evaluation.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-green/20 border border-accent-green/30 rounded-none flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">AVG. INTERVIEW TIME</p>
                  <p className="text-accent-green text-2xl font-bold">15 min</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-green/20 border border-accent-green/30 rounded-none flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">SUCCESS RATE</p>
                  <p className="text-accent-green text-2xl font-bold">98%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-white text-3xl font-semibold mb-8">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-green/20 border border-accent-green/30 rounded-none flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Real-Time Transcription</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Advanced speech-to-text technology powered by Whisper AI for accurate, real-time transcription 
                      of candidate responses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-green/20 border border-accent-green/30 rounded-none flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">AI-Powered Evaluation</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Intelligent assessment using Google Gemini AI to provide comprehensive scoring and 
                      constructive feedback for each answer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-green/20 border border-accent-green/30 rounded-none flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Secure & Private</h3>
                    <p className="text-gray-400 leading-relaxed">
                      All transcriptions and evaluations are processed securely with end-to-end encryption 
                      to protect candidate privacy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-green/20 border border-accent-green/30 rounded-none flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Automated Workflow</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Streamlined interview process with automatic recording, transcription, and evaluation 
                      to save time and ensure consistency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-white text-3xl font-semibold mb-8">How It Works</h2>
            
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-green rounded-none flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2">Admin Creates Interview</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Administrators set up interviews with custom questions and generate shareable links 
                      for candidates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-green rounded-none flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2">Candidate Registers</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Candidates access the interview via the shareable link and register with their 
                      basic information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-green rounded-none flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2">Automated Interview Process</h3>
                    <p className="text-gray-400 leading-relaxed">
                      The system automatically manages reading time, records answers, transcribes speech, 
                      and evaluates responses using AI.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-accent-green rounded-none flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2">Comprehensive Reports</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Admins receive detailed reports with transcripts, scores, and AI-generated feedback 
                      for each candidate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack Section */}
          <div className="card">
            <h2 className="text-white text-3xl font-semibold mb-6">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-dark-input rounded-none border border-dark-border text-center">
                <p className="text-gray-400 text-xs font-medium mb-1">Frontend</p>
                <p className="text-white font-semibold">React</p>
              </div>
              <div className="p-4 bg-dark-input rounded-none border border-dark-border text-center">
                <p className="text-gray-400 text-xs font-medium mb-1">Backend</p>
                <p className="text-white font-semibold">FastAPI</p>
              </div>
              <div className="p-4 bg-dark-input rounded-none border border-dark-border text-center">
                <p className="text-gray-400 text-xs font-medium mb-1">Transcription</p>
                <p className="text-white font-semibold">Whisper</p>
              </div>
              <div className="p-4 bg-dark-input rounded-none border border-dark-border text-center">
                <p className="text-gray-400 text-xs font-medium mb-1">AI Evaluation</p>
                <p className="text-white font-semibold">Gemini</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

