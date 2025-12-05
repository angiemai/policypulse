// src/calculator/Calculator.jsx
import React, { useState } from 'react';
import { Input, InputNumber, Select, Button, Form, Space, Alert, Checkbox, Card, Statistic, Typography, Divider } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import './Calculator.css'; // Import the new CSS file

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

export function Calculator() { // Keep the component name as Calculator
  const [form] = Form.useForm();
  const [calculationResults, setCalculationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = 'http://localhost:8000/calculate_policy_impact';
  const policyOptions = [
    { label: 'Menopause / Perimenopause', value: 'menopause' },
    { label: 'Endometriosis', value: 'endometriosis' },
    { label: 'PCOS', value: 'pcos' },
    { label: 'Ovarian Cancer', value: 'ovarian_cancer' },
    { label: 'Fertility Treatments', value: 'fertility_treatments' },
    { label: 'Prostate Cancer', value: 'prostate_cancer' },
  ];

  const onFinish = async (values) => {
    setError('');
    setCalculationResults(null); // Clear previous results
    setLoading(true);

    try {
      // Ensure all policy values are boolean and send as a dictionary
      const policiesPayload = policyOptions.reduce((acc, option) => {
        acc[option.value] = values.policies.includes(option.value);
        return acc;
      }, {});

      const payload = {
        companyName: values.companyName,
        country: values.country,
        numberOfEmployees: values.numberOfEmployees,
        policies: policiesPayload,
        avgSalary: values.avgSalary || 42000, // Use entered average salary or default
      };

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setCalculationResults(data);
      } else {
        setError(data.detail || 'An unknown error occurred on the server.');
      }
    } catch (err) {
      setError('Failed to connect to the backend. Is the Python server running on port 8000?');
      console.error("Network or backend error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    setError('Please correct the form errors.');
  };

  return (
    <div className="calculator-page-container"> {/* Main container class */}
      {/* Input Form Section */}
      <Card className="calculator-card input-form-card"> {/* Card classes */}
        <Title level={3} className="calculator-title">My Calculator</Title> {/* Title class */}
        <Paragraph className="calculator-description">See the real cost of inaction and the benefit of support.</Paragraph> {/* Paragraph class */}

        <Form
          form={form}
          name="policy_calculator"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ country: 'United Kingdom', policies: [], avgSalary: 42000 }} // Default avg salary
        >
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: 'Please input your company name!' }]}
          >
            <Input placeholder="Enter company name" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: 'Please select your country!' }]}
          >
            <Select placeholder="Select country" disabled={loading}>
              <Option value="United Kingdom">🇬🇧 United Kingdom</Option>
              {/* Add more countries as needed */}
            </Select>
          </Form.Item>

          <Form.Item
            label="Number of Employees"
            name="numberOfEmployees"
            rules={[{ required: true, type: 'number', min: 1, message: 'Please input a valid number of employees!' }]}
          >
            <InputNumber
              className="full-width-input" // Class for full width
              placeholder="Enter number of employees"
              min={1}
              step={1}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Average Employee Salary (£)"
            name="avgSalary"
            rules={[{ required: true, type: 'number', min: 10000, message: 'Please input an average salary!' }]}
          >
            <InputNumber
              className="full-width-input" // Class for full width
              formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/£\s?|(,*)/g, '')}
              placeholder="Enter average salary"
              min={0}
              step={1000}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Policies to Include (Select all that apply)"
            name="policies"
            valuePropName="checkedValues" // For Checkbox.Group
          >
            <Checkbox.Group options={policyOptions} disabled={loading} className="policy-checkbox-group" /> {/* Class for checkbox group */}
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="calculate-button" // Class for calculate button
            >
              Calculate
            </Button>
          </Form.Item>
        </Form>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="error-alert" // Class for alert
          />
        )}
      </Card>

      {/* Results Display Section */}
      <Card className="calculator-card results-display-card"> {/* Card classes */}
        <Title level={3} className="calculator-title">{calculationResults?.companyName || "Company Name"}</Title> {/* Title class */}

        {calculationResults ? (
          <>
            <div className="results-grid"> {/* Grid class */}
              <Statistic
                title="Annual Cost per Employee"
                value={calculationResults.annualCostPerEmployee}
                precision={0}
                formatter={value => `£${value.toLocaleString()}`}
                className="statistic-box" // Statistic box class
              />
              <Statistic
                title="ROI (Moderate Estimate)"
                value={calculationResults.roiAnalysis.moderate.roi_percentage}
                precision={0}
                formatter={value => `${value.toLocaleString()}%`}
                className="statistic-box" // Statistic box class
              />
            </div>

            <Divider orientation="left" className="section-divider">Your Snapshot</Divider> {/* Divider class */}
            <Paragraph className="summary-paragraph"> {/* Paragraph class */}
              <InfoCircleOutlined className="info-icon" /> {/* Icon class */}
              {calculationResults.snapshotSummary}
            </Paragraph>

            <Divider orientation="left" className="section-divider">Annual Estimated Impact: A Snapshot</Divider> {/* Divider class */}
            <Paragraph className="summary-paragraph"> {/* Paragraph class */}
                Based on your {calculationResults.totalEmployees} employees, our model estimates an estimated total annual value lost of <Text strong>{calculationResults.totalAnnualCost}</Text> due to factors related to the health and well-being of your workforce, particularly concerning reproductive health and gender-specific conditions.
            </Paragraph>

            <Title level={4} className="breakdown-title">Breakdown:</Title> {/* Title class */}
            <ul className="breakdown-list"> {/* List class */}
              <li>
                <Text strong>Sick Pay & Productivity Loss:</Text> £{calculationResults.currentCosts.sick_productivity?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <Paragraph className="breakdown-item-description"> {/* Paragraph class */}
                    Understanding the impact: Menopause and other conditions can lead to increased sick days and presenteeism (reduced productivity at work), resulting in significant financial burden.
                </Paragraph>
              </li>
              <li>
                <Text strong>Attrition Costs:</Text> £{calculationResults.currentCosts.attrition?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <Paragraph className="breakdown-item-description"> {/* Paragraph class */}
                    Employee turnover due to health-related issues incurs substantial recruitment and training costs. Supporting employees can reduce this risk.
                </Paragraph>
              </li>
              <li>
                <Text strong>Career Impact Costs:</Text> £{calculationResults.currentCosts.career_impact?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <Paragraph className="breakdown-item-description"> {/* Paragraph class */}
                    Reduced opportunities for promotion or career progression due to health challenges can lead to lost talent and potential for higher earning.
                </Paragraph>
              </li>
              <li>
                <Text strong>Condition-Specific Costs:</Text> £{calculationResults.currentCosts.condition_specific?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <Paragraph className="breakdown-item-description"> {/* Paragraph class */}
                    Direct costs associated with managing specific conditions like Endometriosis, PCOS, Ovarian Cancer, Fertility Treatments, and Prostate Cancer, including healthcare needs and time off.
                </Paragraph>
              </li>
              <li>
                <Text strong>Maternity Costs (Net Employer Cost):</Text> £{calculationResults.currentCosts.maternity?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                <Paragraph className="breakdown-item-description"> {/* Paragraph class */}
                    The net cost to the employer for statutory maternity pay after reclaim, reflecting the financial aspect of supporting new parents.
                </Paragraph>
              </li>
            </ul>

            <Title level={4} className="breakdown-title">Recommendations:</Title> {/* Title class */}
            {calculationResults.recommendations && calculationResults.recommendations.length > 0 ? (
                <ul className="breakdown-list"> {/* List class */}
                    {calculationResults.recommendations.map((rec, index) => (
                        <li key={index}>
                            <Text strong>{rec.title}:</Text> {rec.description} <Text italic>Action: {rec.action}</Text>
                        </li>
                    ))}
                </ul>
            ) : (
                <Paragraph className="summary-paragraph">No specific recommendations generated based on current inputs, but continuous support for employee well-being is always beneficial.</Paragraph>
            )}

            <Divider orientation="left" className="section-divider">Investment Analysis (Annual Cost)</Divider> {/* Divider class */}
            {calculationResults.investmentAnalysis && (
                <ul className="breakdown-list"> {/* List class */}
                    <li><Text strong>Policy Implementation:</Text> £{calculationResults.investmentAnalysis.policy_implementation?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                    <li><Text strong>Platform Costs (e.g., We Are Eden):</Text> £{calculationResults.investmentAnalysis.eden_platform?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                    <li><Text strong>Training:</Text> £{calculationResults.investmentAnalysis.training?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                    <li><Text strong>Management Time:</Text> £{calculationResults.investmentAnalysis.management_time?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                    <li><Text strong>Total Annual Investment:</Text> £{calculationResults.investmentAnalysis.total_annual_cost?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                </ul>
            )}

            <Divider orientation="left" className="section-divider">Return on Investment Scenarios</Divider> {/* Divider class */}
            {calculationResults.roiAnalysis && (
                <div className="roi-scenarios"> {/* ROI scenarios class */}
                    {Object.entries(calculationResults.roiAnalysis).map(([key, scenario]) => (
                        <Card key={key} size="small" className="roi-card"> {/* ROI card class */}
                            <Title level={5} className="roi-title">{scenario.description} ({key.charAt(0).toUpperCase() + key.slice(1)}):</Title> {/* ROI title class */}
                            <Space wrap className="roi-stats-space"> {/* ROI stats space class */}
                                <Statistic
                                    title="Recovered Costs"
                                    value={scenario.recovered_costs}
                                    precision={0}
                                    formatter={value => `£${value.toLocaleString()}`}
                                />
                                <Statistic
                                    title="Net Annual Benefit"
                                    value={scenario.net_annual_benefit}
                                    precision={0}
                                    formatter={value => `£${value.toLocaleString()}`}
                                />
                                <Statistic
                                    title="ROI Percentage"
                                    value={scenario.roi_percentage}
                                    precision={0}
                                    formatter={value => `${value.toLocaleString()}%`}
                                />
                                {scenario.payback_months !== Infinity && (
                                    <Statistic
                                        title="Payback Period"
                                        value={scenario.payback_months}
                                        precision={1}
                                        formatter={value => `${value} Months`}
                                    />
                                )}
                            </Space>
                        </Card>
                    ))}
                </div>
            )}
          </>
        ) : (
          <div className="no-results-message"> {/* No results message class */}
            <InfoCircleOutlined className="no-results-icon" /> {/* Icon class */}
            <Title level={4} className="no-results-title">Enter details and click Calculate to see your company's policy impact.</Title> {/* Title class */}
          </div>
        )}
      </Card>
    </div>
  );
}
