import React, { useState } from 'react'


const Faq = () => {

 const faqs = [

    {
        question: "What is this app about?",
        answer: "This app is designed to help people quit alcohol and substances by providing resources and tools to track progress."
      },
      {
        question: "How do I get started?",
        answer: "Simply create an account and follow the onboarding process to set your goals and track your journey."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we use industry-standard security practices to protect your personal information."
      },
      {
        question: "Can I contact a support team?",
        answer: "Absolutely! You can reach out to us through the 'Contact Us' page or email us at support@example.com."
      }
 ];

 // using this to track which faq is open

  const [activeIndex,setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null:index);
  }




 


    return(
        <div>

            <h1>
                Frequently Asked Questions
            </h1>

            <div>

                {faqs.map((faq,index) => (
                    <div key={index}>
                        <button onClick={()=>toggleFaq(index)}>
                            {faq.question}
                            <span>
                                {activeIndex === index ? "▲":"▼"}
                            </span>
                        
                        </button>
                        {activeIndex === index && (
                            <div>
                                <p>{faq.answer}</p>


                            </div>
                        )}
                    </div>

                ))}
            </div>
        </div>
   
    )

}

export default Faq

