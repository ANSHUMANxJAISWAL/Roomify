package com.roomify.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
    
    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public UnauthorizedException() {
        super("Unauthorized access");
    }
    
    public UnauthorizedException(Throwable cause) {
        super("Unauthorized access", cause);
    }
}
