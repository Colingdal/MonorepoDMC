/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import * as d3 from "d3";
import { OrgChart } from "d3-org-chart";
import i18n from "@sitevision/api/common/i18n";

const renderUserFieldsHTML = (userFields = [], data = {}, headingName = '') => {
  const excludedKeys = ["profileImage", "externalID", "id", "manager", "directReports", "fullname"];
  if (headingName === data.givenName) excludedKeys.push("givenName");
  if (headingName === data.sn) excludedKeys.push("sn");

  return userFields
    .filter(({ key }) => !excludedKeys.includes(key))
    .map(({ key, label }) => {
      const value = data[key] || '';
      const lowerKey = key.toLowerCase();

      if (lowerKey === 'mail') {
        return `<p class="env-ui-text-caption"><strong>Mail: </strong> <a href="mailto:${value}" class="env-link env-link-secondary">${value}</a></p>`;
      }
      if (['telephonenumber', 'phone', 'mobile'].includes(lowerKey)) {
        return `<p class="env-ui-text-caption"><strong>${label}:</strong> <a href="tel:${value}" class="env-link env-link-secondary">${value}</a></p>`;
      }
      return `<p class="env-ui-text-caption"><strong>${label}:</strong> ${value}</p>`;
    }).join('');
};

const calculateNodeHeight = (userFields = [], data = {}, headingName = '') => {
  const excludedKeys = ["profileImage", "externalID", "id", "manager", "directReports", "fullname"];
  if (headingName === data.givenName) excludedKeys.push("givenName");
  if (headingName === data.sn) excludedKeys.push("sn");

  let height = 150;
  if (data.fullname && !excludedKeys.includes("fullname")) height += 20;
  else if (data.givenName && !excludedKeys.includes("givenName")) height += 20;
  else if (data.sn && !excludedKeys.includes("sn")) height += 20;

  userFields
    .filter(({ key }) => !excludedKeys.includes(key))
    .forEach(({ key }) => {
      if (key in data) height += 10;
    });

  return height;
};

const OrgChartComponent = ({ noManager, hexColor, button, socialAllowed }) => {
  const [orgData, setOrgData] = useState([]);
  const [chart, setChart] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isCompact, setIsCompact] = useState(true);
  const chartRef = useRef(null);
  const initialContact = noManager[0];

  const buildOrgData = (contact, parentId = null, collected = []) => {
    collected.push({
      uuid: contact.id,
      manager: parentId,
      name: contact.name,
      firstName: contact.firstName,
      secondName: contact.secondName,
      mobile: contact.mobile,
      phone: contact.phone,
      mail: contact.mail,
      profileImage: contact.profileImage,
      title: contact.title,
      description: contact.description,
      goodToUse: contact.goodToUse,
      userFields: contact.userFields || [],
      data: contact.data || {},
    });

    return requester
      .doGet({ url: router.getStandaloneUrl("/directReports"), data: { id: contact.id } })
      .then((response) => {
        const reports = response.directReportsNodes || [];
        const promises = reports.map((child) => buildOrgData(child, contact.id, collected));
        return Promise.all(promises).then(() => collected);
      })
      .catch((error) => {
        console.error("Error fetching direct reports:", error);
        return collected;
      });
  };

  const applyCustomStyles = () => {
    d3.select(chartRef.current)
      .selectAll('rect.node-rect')
      .style('stroke', `${hexColor}`)

    d3.select(chartRef.current)
      .selectAll('path.link')
      .style('stroke', '#000');
  };

  useEffect(() => {
    if (initialContact) {
      buildOrgData(initialContact).then(setOrgData);
    }
  }, [initialContact]);

  useEffect(() => {
    if (chartRef.current && orgData.length > 0) {
      const heights = orgData.map(contact => {
        const data = contact.data || {};
        const userFields = contact.userFields || [];
        const headingName = data.fullname || data.givenName || data.sn || contact.name;
        return calculateNodeHeight(userFields, data, headingName);
      });

      const maxHeight = Math.max(...heights);

      const chartInstance = new OrgChart()
        .container(chartRef.current)
        .data(orgData)
        .nodeId((d) => d.uuid)
        .parentNodeId((d) => d.manager)
        .nodeWidth(() => 224)
        .nodeHeight(() => maxHeight)
        .childrenMargin(() => 60)
        .compactMarginBetween(() => 50)
        .compactMarginPair(() => 50)
        .neighbourMargin(() => 40)
        .nodeContent((d) => {
          const contact = d.data;
          const hexColorSafe = hexColor || '#0078D4';
          const textColor = hexColorSafe === '#000000' ? '#ffffff' : '#000000';
          const fullname = contact.name || '';
          const initials = fullname.split(' ').map(n => n[0]).join('').toUpperCase();
          const headingName = contact.data?.fullname || contact.data?.givenName || contact.data?.sn || contact.name;
          const userFields = contact.userFields || [];
          const data = contact.data;

          const renderFields = renderUserFieldsHTML(userFields, data, headingName);

          return `
            <article class="example-card env-card env-ui-section" style="width: 14rem; margin: 0 auto; border-style: solid; border-radius: 0; background: white;">
              <div class="env-card__body" style="padding: 20px; height: ${maxHeight}px;">
                <header class="env-card__footer example-flex example-flex--align env-flex env-flex--justify-content-between">
                  ${
                    contact.profileImage
                      ? `<img class="env-card__image env-profile-image env-profile-image--small" src="${contact.profileImage}" alt="Profile image of ${contact.name}" style="width:50px; height:50px; border-radius:50%; object-fit: cover; margin-bottom: 0;" />`
                      : `<div style="width: 50px; height: 50px; border-radius: 50%; background-color: ${hexColorSafe}; display: flex; justify-content: center; align-items: center; color: ${textColor}; font-size: 20px;">${initials}</div>`
                  }
                </header>
                <footer class="env-header">
                  <h3 class="env-ui-text-subheading sv-font-vit-text">${headingName}</h3>
                  ${renderFields}
                 ${
                    socialAllowed === false
                      ? `
                        ${contact.phone ? `
                          <p class="env-ui-text-caption"><strong>Phone: </strong><a href="tel:${contact.phone}" class="env-link env-link-secondary">${contact.phone}</a></p>` : ''}
                        ${contact.mail ? `
                          <p class="env-ui-text-caption"><strong>Mail: </strong><a href="mailto:${contact.mail}" class="env-link env-link-secondary">${contact.mail}</a></p>` : ''}
                      `
                      : ''
                  }
                </footer>
              </div>
            </article>
          `;
        })
        .render()
        .fit();

      applyCustomStyles(); // Apply custom styles after render
      setChart(chartInstance);
    }
  }, [orgData, hexColor]);

  useEffect(() => {
    if (chart) {
      const data = chart.data();
      data.forEach((d) => {
        d._highlighted = false;
        if (searchValue && d.name.toLowerCase().includes(searchValue.toLowerCase())) {
          d._highlighted = true;
          d._expanded = true;
        }
      });
      chart.data(data).render().fit();
      applyCustomStyles();
    }
  }, [searchValue, chart]);

  const handleToggleLayout = () => {
    if (chart) {
      const newLayout = !isCompact;
      setIsCompact(newLayout);
      chart.compact(newLayout).render().fit();
      applyCustomStyles();
    }
  };

  const handleFit = () => {
    if (chart) {
      chart.fit();
      applyCustomStyles();
    }
  };

  const handleZoomIn = () => {
    if (chart) {
      chart.zoomIn();
      applyCustomStyles();
    }
  };

  const handleZoomOut = () => {
    if (chart) {
      chart.zoomOut();
      applyCustomStyles();
    }
  };

  const handleExpandAll = () => {
    if (chart) {
      chart.expandAll().render().fit();
      applyCustomStyles();
    }
  };

  const handleCollapseAll = () => {
    if (chart) {
      chart.collapseAll().render().fit();
      applyCustomStyles();
    }
  };

  let buttonClass = 'env-button env-m-top--small';
  if (button === 'primary') {
    buttonClass += ' env-button--primary';
  } else if (button === 'secondary') {
    buttonClass += ' env-button--secondary';
  }

  return (
    <div style={{ width: '100%', backgroundColor: 'white' }} className="chart-container" ref={chartRef}>
      <div className="example-flex env-flex--wrap example-flex--align env-flex env-flex--justify-content-around">
        <div className="env-flex__item env-form-field">
          <div className="env-form-control">
            <input
              type="search"
              className="env-form-input env-form-input--search env-m-top--small"
              placeholder={i18n.get('search')}
              id="search-1"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <div className="env-flex__item"><button type="button" className={buttonClass} onClick={handleToggleLayout}>{isCompact ? i18n.get('horizontal') : i18n.get('compact')}</button></div>
        <div className="env-flex__item"><button type="button" className={buttonClass} onClick={handleFit}>{i18n.get('f2screen')}</button></div>
        <div className="env-flex__item"><button type="button" className={buttonClass} onClick={handleExpandAll}>{i18n.get('expand')}</button></div>
        <div className="env-flex__item"><button type="button" className={buttonClass} onClick={handleCollapseAll}>{i18n.get('collapse')}</button></div>
        <div className="env-flex__item"><button type="button" className={buttonClass} onClick={handleZoomIn}>+</button></div>
        <div className="env-flex__item"><button type="button" className={buttonClass} onClick={handleZoomOut}>-</button></div>
      </div>
    </div>
  );
};

export default OrgChartComponent;
