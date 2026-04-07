/**
 * DocSidebar/Desktop swizzle — 사이드바 하단 중앙에 hits.sh 방문자 배지
 */
import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import Logo from '@theme/Logo';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';

import styles from './styles.module.css';

function SidebarHitsBadge() {
  return (
    <div className={styles.hitsWrap}>
      <a
        href="https://hits.sh/sapcy.github.io/"
        target="_blank"
        rel="noopener noreferrer">
        <img
          alt="Hits"
          src="https://hits.sh/sapcy.github.io.svg?view=today-total&color=116dcc&logo=blogger"
        />
      </a>
    </div>
  );
}

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  return (
    <div
      className={clsx(
        styles.sidebar,
        hideOnScroll && styles.sidebarWithHideableNavbar,
        isHidden && styles.sidebarHidden,
      )}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <Content path={path} sidebar={sidebar} />
      <SidebarHitsBadge />
      {hideable && <CollapseButton onClick={onCollapse} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
