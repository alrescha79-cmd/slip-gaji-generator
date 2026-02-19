<script lang="ts">
    import type {
        Company,
        Employee,
        PayrollResult,
        Attendance,
        PayslipMeta,
        PayslipTemplate,
    } from "../types";
    import ModernTemplate from "./templates/ModernTemplate.svelte";
    import ClassicTemplate from "./templates/ClassicTemplate.svelte";
    import CompactTemplate from "./templates/CompactTemplate.svelte";
    import LandscapeTemplate from "./templates/LandscapeTemplate.svelte";

    let { company, employee, result, attendance, meta } = $props<{
        company: Company;
        employee: Employee;
        result: PayrollResult;
        attendance?: Attendance;
        meta: PayslipMeta;
    }>();

    import type { Component } from "svelte";

    const templates: Record<PayslipTemplate, Component<any>> = {
        modern: ModernTemplate as Component<any>,
        classic: ClassicTemplate as Component<any>,
        compact: CompactTemplate as Component<any>,
        landscape: LandscapeTemplate as Component<any>,
    };

    const SelectedTemplate = $derived(
        templates[meta.template as keyof typeof templates],
    );
</script>

<SelectedTemplate {company} {employee} {result} {attendance} {meta} />
