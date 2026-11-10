
import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children }) => {
  return (
    <section id={id} className="py-20 animate-slide-up">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-3">{title}</h2>
        {subtitle && <p className="text-gray-500 max-w-xl mx-auto">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
};

export default Section;
