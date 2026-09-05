def get_recommendation(asset_type, fault):
    if fault is None:
        return "Continue normal monitoring"

    recommendations = {
        "Lamp Failure": "Inspect or replace the streetlight lamp",
        "Pole Hit": "Inspect pole and electrical connections",
        "Power Failure": "Check power supply and wiring",
        "Low Voltage": "Inspect electrical supply",
        "Sensor Failure": "Inspect or replace faulty sensors",

        "Leak": "Inspect pipeline for leakage",
        "Blockage": "Inspect and clear pipeline blockage",
        "Pressure Drop": "Inspect pipeline pressure",
        "Valve Failure": "Inspect or replace valve",

        "Overflow": "Schedule immediate cleaning or waste collection",
        "Gas Leak": "Inspect bin for hazardous gas accumulation",
        "Battery Low": "Recharge or replace battery",

        "Bad Odor": "Clean toilet and inspect ventilation",
        "Water Shortage": "Refill or inspect water supply",
        "Cleaning Required": "Schedule toilet cleaning",
    }

    return recommendations.get(fault, "Inspect asset")
