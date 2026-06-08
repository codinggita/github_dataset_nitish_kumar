import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 border-t border-slate-200 dark:border-dark-border text-center text-sm text-slate-500 dark:text-slate-400 mt-auto bg-white dark:bg-dark-card/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 GitData.io. All rights reserved. Created for Nitish Kumar Full Stack project.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
