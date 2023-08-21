import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'React Integration',
    image: require('@site/static/img/code-developer.png').default,
    description: (
      <>
        Learn best practices, tips, and tricks for creating dynamic user interfaces while harnessing the power of Contensis as your content engine.
      </>
    ),
  },
  {
    title: 'Advanced Techniques',
    image: require('@site/static/img/content-building.png').default,
    description: (
      <>
         Elevate your skills by exploring advanced techniques like server-side rendering, dynamic routing, and optimizing performance.
      </>
    ),
  },
  {
    title: 'Community and Support',
    image: require('@site/static/img/community.png').default,
    description: (
      <>
       Join a vibrant community of like-minded developers who are on the same journey. Share your insights, seek advice, and collaborate.
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={image} className={styles.featureSvg} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
