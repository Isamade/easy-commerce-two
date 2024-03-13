import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Your Daily Grocery',
  description: 'We sell the best for cheap',
  keywords: 'groceries, buy groceries, cheap groceries',
};

export default Meta;
