import React from 'react';
import { FileText, Cpu, FileSpreadsheet, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">About HandyConvert</h1>
        <p className="text-lg text-slate-600">
          HandyConvert helps you extract data from handwritten text in images and PDFs,
          converting it to Excel format for easy analysis and manipulation.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">1. Upload Files</h3>
            <p className="text-slate-600">
              Upload your PDF documents or images containing handwritten text, tables, or forms.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
              <Cpu className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">2. AI Processing</h3>
            <p className="text-slate-600">
              Our AI analyzes your documents, recognizes the handwritten text, and extracts the data.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">3. Get Excel Files</h3>
            <p className="text-slate-600">
              Download the extracted data as Excel files that you can easily manipulate and analyze.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800">Benefits</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex space-x-4">
            <div className="shrink-0 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Save Time</h3>
              <p className="text-slate-600">
                Eliminate hours of manual data entry with automated text recognition.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="shrink-0 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Increase Accuracy</h3>
              <p className="text-slate-600">
                Reduce human error in data transcription with precise AI extraction.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="shrink-0 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Process in Bulk</h3>
              <p className="text-slate-600">
                Convert multiple documents simultaneously for increased efficiency.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="shrink-0 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Easy Integration</h3>
              <p className="text-slate-600">
                Seamlessly integrate the Excel output with your existing workflows and systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-800">Get Started Today</h2>
        <p className="text-slate-700">
          Start converting your handwritten documents to Excel format and save hours of manual data entry.
        </p>
        <div>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Upload Your First Document
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;