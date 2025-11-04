package com.roomify.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderRecurrence {

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type")
    private RecurrenceType type;

    @Builder.Default
    private Integer interval = 1;

    private LocalDate endDate;

    private Integer maxOccurrences;

    public enum RecurrenceType {
        DAILY,
        WEEKLY,
        MONTHLY,
        YEARLY
    }
}
