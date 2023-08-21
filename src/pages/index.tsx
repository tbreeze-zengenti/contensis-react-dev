import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      {/* <div className="container"> */}
        <div className="content">
        <h1 className="hero__title">Get started developing with React and Contensis</h1>
        <p className="hero__subtitle">Learn about the exciting possibilities of combining the versatility of React with the robust capabilities of Contensis</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction"
          >
            Get Started
          </Link>
        </div>
        </div>
      {/* </div> */}
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main className="home" >
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
