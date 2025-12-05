# src/calculator/calculations.py
import math
from .constants import (
    SSP_WEEKLY_RATE, SMP_SPP_RATE, SSP_LOWER_EARNINGS_LIMIT, WEEKS_IN_YEAR,
    WORKING_DAYS_IN_WEEK, SMP_SPP_RECLAIM_RATE, RECRUITMENT_FEE_PERCENT,
    MATERNITY_LEAVE_DURATION_WEEKS,
    POLICY_IMPLEMENTATION_RATE, WE_ARE_EDEN_ANNUAL_COST,
    WORKFORCE_MEN_PERCENTAGE, WORKFORCE_WOMEN_PERCENTAGE,
    MENOPAUSE_UK_PERCENTAGE, ENDOMETRIOSIS_UK_PERCENTAGE,
    PROSTATE_CANCER_PERCENTAGE, WORKFORCE_CANCER_PERCENTAGE, COST_OF_CANCER
)

def _calculate_sick_pay_costs(sick_days: int, company_sick_pay_days: int, daily_salary: float, average_weekly_earnings: float) -> dict:
    """
    Calculate sick pay costs for an employer, combining Company Sick Pay (CSP) and Statutory Sick Pay (SSP).
    """
    if average_weekly_earnings < SSP_LOWER_EARNINGS_LIMIT:
        ssp_eligible = False
    else:
        ssp_eligible = True

    if sick_days < 4:
        ssp_eligible_for_period = False
    else:
        ssp_eligible_for_period = True

    full_pay_days = min(sick_days, company_sick_pay_days)
    full_pay_cost = full_pay_days * daily_salary

    ssp_cost = 0.0
    ssp_payable_days = 0

    if ssp_eligible and ssp_eligible_for_period:
        ssp_waiting_days = 3
        unpaid_by_csp_calendar_days = sick_days - full_pay_days
        effective_ssp_waiting_days_after_csp = max(0, ssp_waiting_days - full_pay_days)
        ssp_eligible_calendar_days_after_csp_and_waiting = max(0, unpaid_by_csp_calendar_days - effective_ssp_waiting_days_after_csp)
        ssp_qualifying_days_to_pay = math.ceil(ssp_eligible_calendar_days_after_csp_and_waiting / 7 * WORKING_DAYS_IN_WEEK)
        max_ssp_qualifying_days = 28 * WORKING_DAYS_IN_WEEK
        ssp_payable_days = min(ssp_qualifying_days_to_pay, max_ssp_qualifying_days)
        ssp_cost = (ssp_payable_days / WORKING_DAYS_IN_WEEK) * SSP_WEEKLY_RATE

    return {
        'full_pay_days': full_pay_days,
        'full_pay_cost': full_pay_cost,
        'ssp_qualifying_days_paid': ssp_payable_days,
        'ssp_cost': ssp_cost,
        'total_sick_pay_cost': full_pay_cost + ssp_cost,
        'ssp_eligible': ssp_eligible,
        'ssp_eligible_for_period': ssp_eligible_for_period
    }

def _calculate_productivity_loss(sick_days, daily_salary):
    """Calculate productivity loss due to presenteeism"""
    presenteeism_days = sick_days * 2
    return presenteeism_days * daily_salary * 0.3

def _calculate_condition_costs(salary, policies_selected):
    """
    Calculate condition-specific additional costs based on selected policies.
    Assumes cost is a percentage of salary for affected individuals.
    """
    costs = {'conditions': [], 'total': 0}

    if policies_selected.get('endometriosis'):
        endo_cost = salary * 0.08
        costs['conditions'].append({
            'condition': 'Endometriosis',
            'cost': endo_cost,
            'percentage': 8,
            'description': 'Additional healthcare needs, appointments, reduced productivity'
        })
        costs['total'] += endo_cost

    if policies_selected.get('pcos'):
        pcos_cost = salary * 0.05
        costs['conditions'].append({
            'condition': 'PCOS',
            'cost': pcos_cost,
            'percentage': 5,
            'description': 'Medical appointments, treatment time, symptom management'
        })
        costs['total'] += pcos_cost

    if policies_selected.get('menopause'):
        menopause_cost = salary * 0.07
        costs['conditions'].append({
            'condition': 'Menopause / Perimenopause',
            'cost': menopause_cost,
            'percentage': 7,
            'description': 'Productivity loss, medical consultations, and support needs'
        })
        costs['total'] += menopause_cost

    if policies_selected.get('ovarian_cancer'):
        ovarian_cancer_cost = salary * 0.10
        costs['conditions'].append({
            'condition': 'Ovarian Cancer',
            'cost': ovarian_cancer_cost,
            'percentage': 10,
            'description': 'Significant medical costs, treatment, and recovery'
        })
        costs['total'] += ovarian_cancer_cost

    if policies_selected.get('fertility_treatments'):
        fertility_cost = salary * 0.07
        costs['conditions'].append({
            'condition': 'Fertility Treatments',
            'cost': fertility_cost,
            'percentage': 7,
            'description': 'Treatment costs, time off for appointments, emotional impact'
        })
        costs['total'] += fertility_cost

    if policies_selected.get('prostate_cancer'):
        prostate_cancer_cost = salary * 0.09
        costs['conditions'].append({
            'condition': 'Prostate Cancer',
            'cost': prostate_cancer_cost,
            'percentage': 9,
            'description': 'Medical costs, time off for treatment, and recovery'
        })
        costs['total'] += prostate_cancer_cost

    return costs

def _calculate_maternity_costs(on_maternity_leave, maternity_weeks):
    """Calculate net maternity leave costs"""
    if not on_maternity_leave:
        return 0

    total_maternity_pay = maternity_weeks * SMP_SPP_RATE
    reclaim_amount = total_maternity_pay * SMP_SPP_RECLAIM_RATE
    return total_maternity_pay - reclaim_amount

def _calculate_attrition_risk(salary, has_endometriosis, has_pcos):
    """Calculate attrition risk and associated costs"""
    base_attrition_risk = 0.12

    if has_endometriosis or has_pcos:
        health_impact_multiplier = 1.5
    else:
        health_impact_multiplier = 1.25

    adjusted_attrition_risk = min(base_attrition_risk * health_impact_multiplier, 0.25)
    recruitment_cost = salary * (RECRUITMENT_FEE_PERCENT / 100)
    risk_weighted_cost = recruitment_cost * adjusted_attrition_risk

    return {
        'base_risk': base_attrition_risk,
        'adjusted_risk': adjusted_attrition_risk,
        'recruitment_cost': recruitment_cost,
        'risk_weighted': risk_weighted_cost
    }

def _calculate_career_impact(salary, has_endometriosis, has_pcos):
    """Calculate career progression impact due to health conditions"""
    base_impact_percentage = 0.05
    if has_endometriosis or has_pcos:
        impact_multiplier = 1.8
    else:
        impact_multiplier = 1.0

    career_impact_cost = salary * base_impact_percentage * impact_multiplier
    return career_impact_cost

def _calculate_employee_breakdown(total_employees, female_employees, male_employees, policies_selected):
    """
    Calculate breakdown of affected employees based on selected policies and general workforce percentages.
    """
    menopause_prevalence_pct = MENOPAUSE_UK_PERCENTAGE * 100
    endometriosis_prevalence_pct = ENDOMETRIOSIS_UK_PERCENTAGE * 100
    pcos_prevalence_pct = 10
    ovarian_cancer_prevalence_pct = 0.01
    fertility_prevalence_pct = 12
    prostate_cancer_prevalence_pct = PROSTATE_CANCER_PERCENTAGE * WORKFORCE_CANCER_PERCENTAGE * 100

    endo_employees = round((female_employees * (endometriosis_prevalence_pct / 100))) if policies_selected.get('endometriosis') else 0
    pcos_employees = round((female_employees * (pcos_prevalence_pct / 100))) if policies_selected.get('pcos') else 0
    menopause_employees = round((female_employees * (menopause_prevalence_pct / 100))) if policies_selected.get('menopause') else 0
    ovarian_cancer_employees = round((female_employees * (ovarian_cancer_prevalence_pct / 100))) if policies_selected.get('ovarian_cancer') else 0
    fertility_employees = round((female_employees * (fertility_prevalence_pct / 100))) if policies_selected.get('fertility_treatments') else 0
    prostate_cancer_employees = round((male_employees * (prostate_cancer_prevalence_pct / 100))) if policies_selected.get('prostate_cancer') else 0

    annual_maternity_leaves = round(female_employees * 0.05)

    return {
        'total_female': female_employees,
        'total_male': male_employees,
        'endometriosis_affected': endo_employees,
        'pcos_affected': pcos_employees,
        'menopause_affected': menopause_employees,
        'ovarian_cancer_affected': ovarian_cancer_employees,
        'fertility_affected': fertility_employees,
        'prostate_cancer_affected': prostate_cancer_employees,
        'annual_maternity_leaves': annual_maternity_leaves,
        'overlap_estimate': round(min(endo_employees, pcos_employees) * 0.1)
    }

def _calculate_current_company_costs(total_employees, female_employees, male_employees, avg_salary, breakdown, policies_selected):
    """Calculate total current costs across all employees."""
    daily_salary = avg_salary / (WEEKS_IN_YEAR * WORKING_DAYS_IN_WEEK)

    avg_sick_days = 15
    total_sick_productivity_cost = (
        (avg_sick_days * daily_salary) +
        (avg_sick_days * 2 * daily_salary * 0.3)
    ) * total_employees

    recruitment_cost_per_employee = avg_salary * (RECRUITMENT_FEE_PERCENT / 100)
    avg_attrition_risk = 0.15
    total_attrition_cost = recruitment_cost_per_employee * avg_attrition_risk * total_employees

    career_impact_per_employee = avg_salary * 0.15 * 0.15
    total_career_impact_cost = career_impact_per_employee * total_employees

    total_condition_specific_costs = 0
    if policies_selected.get('menopause') and breakdown['menopause_affected'] > 0:
        total_condition_specific_costs += breakdown['menopause_affected'] * (avg_salary * 0.07)
    if policies_selected.get('endometriosis') and breakdown['endometriosis_affected'] > 0:
        total_condition_specific_costs += breakdown['endometriosis_affected'] * (avg_salary * 0.08)
    if policies_selected.get('pcos') and breakdown['pcos_affected'] > 0:
        total_condition_specific_costs += breakdown['pcos_affected'] * (avg_salary * 0.05)
    if policies_selected.get('ovarian_cancer') and breakdown['ovarian_cancer_affected'] > 0:
        total_condition_specific_costs += breakdown['ovarian_cancer_affected'] * (avg_salary * 0.10)
    if policies_selected.get('fertility_treatments') and breakdown['fertility_affected'] > 0:
        total_condition_specific_costs += breakdown['fertility_affected'] * (avg_salary * 0.07)
    if policies_selected.get('prostate_cancer') and breakdown['prostate_cancer_affected'] > 0:
        total_condition_specific_costs += breakdown['prostate_cancer_affected'] * (avg_salary * 0.09)

    maternity_cost_per_leave = MATERNITY_LEAVE_DURATION_WEEKS * SMP_SPP_RATE * (1 - SMP_SPP_RECLAIM_RATE)
    total_maternity_costs = maternity_cost_per_leave * breakdown['annual_maternity_leaves']

    total_cost = (
        total_sick_productivity_cost +
        total_attrition_cost +
        total_career_impact_cost +
        total_condition_specific_costs +
        total_maternity_costs
    )

    return {
        'sick_productivity': total_sick_productivity_cost,
        'attrition': total_attrition_cost,
        'career_impact': total_career_impact_cost,
        'condition_specific': total_condition_specific_costs,
        'maternity': total_maternity_costs,
        'total': total_cost,
        'per_employee': total_cost / total_employees if total_employees > 0 else 0
    }

def _calculate_company_investment(total_employees, female_employees, avg_salary, policies_selected):
    """Calculate total investment required for company-wide implementation."""
    policy_implementation_cost = 0
    eden_platform_cost = 0

    if any(policies_selected.values()):
        policy_implementation_cost = total_employees * avg_salary * POLICY_IMPLEMENTATION_RATE
        eden_platform_cost = female_employees * WE_ARE_EDEN_ANNUAL_COST

    training_cost = total_employees * 50
    management_time_cost = avg_salary * 0.02 * total_employees

    total_annual_cost = (
        policy_implementation_cost + eden_platform_cost +
        training_cost + management_time_cost
    )

    return {
        'policy_implementation': policy_implementation_cost,
        'eden_platform': eden_platform_cost,
        'training': training_cost,
        'management_time': management_time_cost,
        'total_annual_cost': total_annual_cost,
        'cost_per_employee': total_annual_cost / total_employees if total_employees > 0 else 0,
        'cost_per_female_employee': total_annual_cost / female_employees if female_employees > 0 else 0
    }

def _calculate_company_roi(total_current_cost, total_investment_cost):
    """Calculate ROI for company-wide implementation"""
    scenarios = {
        'conservative': {'recovery_rate': 0.50, 'description': 'Conservative estimate'},
        'moderate': {'recovery_rate': 0.60, 'description': 'Realistic target'},
        'optimistic': {'recovery_rate': 0.65, 'description': 'Best case scenario'}
    }

    roi_analysis = {}

    for scenario_name, scenario in scenarios.items():
        recovered_costs = total_current_cost * scenario['recovery_rate']
        net_benefit = recovered_costs - total_investment_cost
        roi_percentage = (net_benefit / total_investment_cost) * 100 if total_investment_cost > 0 else 0
        payback_months = (total_investment_cost / recovered_costs) * 12 if recovered_costs > 0 else float('inf')

        roi_analysis[scenario_name] = {
            'recovered_costs': recovered_costs,
            'net_annual_benefit': net_benefit,
            'roi_percentage': roi_percentage,
            'payback_months': payback_months,
            'description': scenario['description']
        }

    return roi_analysis

def _assess_current_policies(inputs):
    """Assess current policy coverage (placeholder based on your notebook)"""
    policies = {
        'menopause_policy': inputs.get('has_menopause_policy', False),
        'fertility_support': inputs.get('has_fertility_support', False),
        'flexible_working': inputs.get('has_flexible_working', True),
        'health_insurance': inputs.get('has_health_insurance', True)
    }

    policy_score = sum(policies.values()) / len(policies) * 100
    gaps = [policy for policy, implemented in policies.items() if not implemented]

    return {
        'current_policies': policies,
        'policy_coverage_percentage': policy_score,
        'policy_gaps': gaps,
        'readiness_level': 'High' if policy_score > 75 else 'Medium' if policy_score > 50 else 'Low'
    }

def _generate_company_recommendations(current_costs, investment_analysis, roi_analysis):
    """Generate strategic recommendations for the company"""
    recommendations = []

    optimistic_roi = roi_analysis['optimistic']['roi_percentage']
    payback_months = roi_analysis['optimistic']['payback_months']

    if optimistic_roi > 300:
        recommendations.append({
            'priority': 'Critical',
            'category': 'Financial',
            'title': 'Exceptional ROI Opportunity',
            'description': f'With {optimistic_roi:.0f}% ROI and {payback_months:.1f} month payback, this is a critical business opportunity.',
            'action': 'Immediate board presentation and budget allocation'
        })

    if payback_months < 12:
        recommendations.append({
            'priority': 'High',
            'category': 'Implementation',
            'title': 'Rapid Payback Period',
            'description': f'Investment recovers in {payback_months:.1f} months - faster than most business initiatives.',
            'action': 'Fast-track implementation planning'
        })

    annual_cost = current_costs['total']
    if annual_cost > 1000000:
        recommendations.append({
            'priority': 'Urgent',
            'category': 'Risk Management',
            'title': 'Significant Hidden Costs',
            'description': f'Current reproductive health challenges cost £{annual_cost:,.0f} annually.',
            'action': 'Comprehensive audit of current support systems'
        })

    return recommendations

def calculate_company_impact(inputs: dict) -> dict:
    """
    Main entry point to calculate company-wide reproductive health costs and ROI.
    This function integrates all sub-calculations.
    """
    total_employees = inputs.get('numberOfEmployees', 0)
    company_name = inputs.get('companyName', 'Your Company')
    avg_salary = inputs.get('avgSalary', 42000)
    policies_selected = inputs.get('policies', {})

    female_employees = round(total_employees * WORKFORCE_WOMEN_PERCENTAGE)
    male_employees = round(total_employees * WORKFORCE_MEN_PERCENTAGE)

    employee_breakdown = _calculate_employee_breakdown(
        total_employees, female_employees, male_employees, policies_selected
    )

    current_costs = _calculate_current_company_costs(
        total_employees, female_employees, male_employees, avg_salary, employee_breakdown, policies_selected
    )

    investment_analysis = _calculate_company_investment(
        total_employees, female_employees, avg_salary, policies_selected
    )

    roi_analysis = _calculate_company_roi(
        current_costs['total'], investment_analysis['total_annual_cost']
    )

    recommendations = _generate_company_recommendations(
        current_costs, investment_analysis, roi_analysis
    )

    return {
        'companyName': company_name,
        'totalEmployees': total_employees,
        'femaleEmployees': female_employees,
        'maleEmployees': male_employees,
        'avgSalary': avg_salary,
        'policiesSelected': policies_selected,
        'employeeBreakdown': employee_breakdown,
        'currentCosts': current_costs,
        'investmentAnalysis': investment_analysis,
        'roiAnalysis': roi_analysis,
        'recommendations': recommendations,
        'annualCostPerEmployee': current_costs['total'] / total_employees if total_employees > 0 else 0,
        'snapshotSummary': (
            f"Based on your {total_employees} employees, our model estimates an "
            f"annual loss of £{current_costs['total']:,.0f} due to various health challenges and associated factors. "
            f"Implementing comprehensive policies could yield an ROI of approximately {roi_analysis['moderate']['roi_percentage']:.0f}% "
            f"with a net annual benefit of £{roi_analysis['moderate']['net_annual_benefit']:,.0f}."
        )
    }
