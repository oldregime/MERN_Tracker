import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Developed By divyansh joshi , shambhavi jha , raj aryan sharma and yash.</p>
      </div>
    </footer>
  );
};

export default Footer;
