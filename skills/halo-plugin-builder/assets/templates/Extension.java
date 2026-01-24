package com.example.plugin.extension;

import lombok.Data;
import lombok.EqualsAndHashCode;
import run.halo.app.extension.AbstractExtension;
import run.halo.app.extension.GVK;

@Data
@EqualsAndHashCode(callSuper = true)
@GVK(group = "plugin.halo.run", version = "v1alpha1", kind = "Example", plural = "examples", singular = "example")
public class Example extends AbstractExtension {

    private Spec spec;

    private Status status;

    @Data
    public static class Spec {
        private String name;
        private boolean enabled;
    }

    @Data
    public static class Status {
        private String phase;
    }
}
