import "../styles/NewsLetter.css";

const Newsletter = () => {
  return (
    <section className="newsletter-wrapper">
      <span className="dot dot-pink"></span>
      <span className="dot dot-green"></span>
      <span className="dot dot-orange"></span>

      <div className="newsletter-card">
        <h2>Newsletter</h2>

        <p>
          PFE Book, CV, Lettre de motivation, Rapport de stage, Conseils
          carrière et évènements — tout-en-un seul abonnement.
        </p>

        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Adresse e-mail "
            required
          />
          <button type="submit">
            ✈ S'abonner
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
